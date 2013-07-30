

#def main
	client = Mysql2::Client.new(:host => "mysql5.serv.uni-osnabrueck.de",:username => "sosruntime", :password => "soSRuntime", :database => "misdb")

	#Get all studying Students
	students = client.query(
		"SELECT DISTINCT
			STG_MATRIKELNR AS 'matriculation_number',
			STG_GEBJAHR AS 'gender',
			STG_GESCHLECHT AS 'gender',
			STG_STAATSANGH AS 'nationality',
			STG_HZBORT AS 'HZBOrt'
		FROM FKT_STUDIENGAENGE
		LIMIT 40
		")
	
	studentMap = Hash.new
	#Create all the students
	students.each do |student|
		
		#Delete HZBOrt from hash so that we can use it to create the student
		hzbOrt = student.delete("HZBOrt")

		studentDB = Student.new(student)
		
		#Get students location
		location = client.query(
			"SELECT
				HZBO_STADT as 'name',
				HZBO_BUNDESLAND as 'federal_state',
				HZBO_STAAT as 'country'
			FROM DIM_HZBORTE
			WEHRE HZBO_ID = '#{hzbOrt}'
			LIMIT 1").each

		if(!location.empty?)
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

			locationDB = Location.find_by(federal_state_id: fedState.id, country_id: country.id, name: location["name"])
			if(locationDB == nil)
				locationDB = Location.new(federal_state_id: fedState.id, country_id: country.id, name: location["name"])
				locationDB.save
			end
		end
		studentDB.location= locationDB
	
		#Get study fields for Student
		#fieldIDs = client.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE STG_MATRIKELNR = '#{studentDB.id}'")
		#studentMap[studentDB] = fieldIDs
	end
#end
