

def migrate
	client = Mysql2::Client.new(
		:host => "mysql5.serv.uni-osnabrueck.de",
		:username => "sosruntime",
		:password => "soSRuntime",
		:database => "misdb")

	#Get all studying Students
	students = client.query(
		"SELECT DISTINCT
			STG_MATRIKELNR AS 'matriculation_number',
			STG_GEBJAHR AS 'year_of_birth',
			STG_GESCHLECHT AS 'gender',
			STG_STAATSANGH AS 'nationality',
			STG_HZBORT AS 'HZBOrt'
		FROM FKT_STUDIENGAENGE")

	locations = createLocations
	
	#Create all the students
	students.each do |student|
		
		#Delete HZBOrt from hash so that we can use it to create the student
		hzbOrt = student.delete("HZBOrt")

		studentDB = Student.find_by_matriculation_number(student["matriculation_number"])
		if(studentDB == nil)
			studentDB = Student.new(student)
		else
			#Silly overwrite of all attributes!
			studentDB.assign_attributes(student)
		end
		
		studentDB.location = locations[hzbOrt]
		studentDB.save
	
		#Get study fields for Student
		#fieldIDs = client.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE STG_MATRIKELNR = '#{studentDB.id}'")
		#studentMap[studentDB] = fieldIDs
	end
end

#Dumb creation of all locations with their countries
def createLocations
	locQuery = client.query(
		"SELECT
			HZBO_STADT as 'name',
			HZBO_BUNDESLAND as 'federal_state',
			HZBO_STAAT as 'country',
			HZBO_ID as 'id'
		FROM DIM_HZBORTE")

	locations = Hash.new
	locQuery.each do |location|
		locID = location.delete("id")
		
		country = Country.find_by_name(location["country"])

		if(country == nil)
			#If we could not find the country we have to create it
			country = Country.new
			country.name = location["country"]
			country.save
		end

		if(location["federal_state"] != nil)
			fedState = FederalState.find_by_name(location["federal_state"])
			if(fedState == nil)
				#If we could not find the federal state we have to create it
				fedState = FederalState.new
				fedState.name = location["federal_state"]
				fedState.save
			end
		end

		if(location["name"]==nil)
			location["name"] = "Ausland"
		end
		
		locationAttributes = {federal_state_id:nil, country_id: country.id, name:location["name"]}
		if(fedState != nil)
			locationAttributes["federal_state_id"] = fedState.id
		end
		locationDB = Location.find_by(locationAttributes)
		if(locationDB == nil)
			locationDB = Location.new(locationAttributes)
			locationDB.save
		end

		locations[locID] = locationDB
	end
	return locations
end