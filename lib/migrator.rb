module Migrator

	BATCHSIZE = 10000

	#This query retrieves the last entry for each students study field.
	QUERY_LAST_FIELD_INFO = 
	"select FKT_STUDIENGAENGE.*
	from
			FKT_STUDIENGAENGE
		join (
			select STG_MATRIKELNR as X, max(STG_SEMESTER) as Y
			from FKT_STUDIENGAENGE
			group by STG_MATRIKELNR, STG_FACH
			)as Stud
		on `STG_MATRIKELNR` = X and `STG_SEMESTER` = Y"

	#This query retrieves the latest and therfore the most recent entry given for each student
	QUERY_LAST_STUDENT_INFO = 
	"select FKT_STUDIENGAENGE.*
	from
			FKT_STUDIENGAENGE
		join (
			select STG_MATRIKELNR as X, max(STG_SEMESTER) as Y
			from FKT_STUDIENGAENGE
			group by STG_MATRIKELNR
			)as Stud
		on `STG_MATRIKELNR` = X and `STG_SEMESTER` = Y
	group by STG_MATRIKELNR"

	def self.client
		return client = Mysql2::Client.new(
			:host => "mysql5.serv.uni-osnabrueck.de",
			:username => "sosruntime",
			:password => "soSRuntime",
			:database => "misdb")
	end

	def self.migrate
		
		print "start migration\n"

		locations = createLocations

		print "loading students in batches of #{BATCHSIZE}\n"
		allbatches = client.query(
			"SELECT floor(count(STG_MATRIKELNR)/#{BATCHSIZE}) as batches
			FROM (#{QUERY_LAST_STUDENT_INFO}) as LI").first["batches"]

		for batchnumber in 0..allbatches
			print "retrieving batch #{batchnumber+1} of #{allbatches+1}\n"

			students = client.query(
				"SELECT
					STG_MATRIKELNR AS 'matriculation_number',
					STG_GEBJAHR AS 'year_of_birth',
					STG_GESCHLECHT AS 'gender',
					STG_STAATSANGH AS 'nationality',
					STG_HZBORT AS 'HZBOrt'
				FROM (#{QUERY_LAST_STUDENT_INFO}) as LI
				LIMIT #{batchnumber*BATCHSIZE},#{BATCHSIZE}
				")
			numAll = students.each.length
			print "now iterating over the batch and creating missing students\n"
			
			dBstudents = Array.new
			numDone = 0
			numCreated = 0
			print "         50%v       100%v\n"
			step = numAll / 25
			#Create all the students
			students.each do |student|
				if(((numDone += 1) % step) == 0)
					print "*"
				end
				
				#Delete HZBOrt from hash so that we can use it to create the student
				hzbOrt = student.delete("HZBOrt")

				studentDB = Student.find_by_matriculation_number(student["matriculation_number"])
				if(studentDB == nil)
					studentDB = Student.new(student)
					numCreated += 1
					studentDB.location = locations[hzbOrt]
					dBstudents.insert(0,studentDB)
				end
			
				#Get study fields for Student
				#fieldIDs = client.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE STG_MATRIKELNR = '#{studentDB.id}'")
				#studentMap[studentDB] = fieldIDs
			end
			print "\n done. Created #{numCreated} new "+"student".pluralize(numCreated)+"\n"

			if(numCreated > 0)
				print "now saving them\n"
				print "         50%v       100%v\n"
				step = numCreated / 25
				numDone = 0
				Student.transaction do
					dBstudents.each do |student|
						if(((numDone += 1) % step) == 0)
							print "*"
						end
						student.save
					end
				end
				print "done\n"
			end
		end
	end

	#Dumb creation of all not yet existing locations with
	#their countries and federal states if exitend
	def self.createLocations
		print "retrieving locations\n"

		#Here the whole table is loaded into memory
		#Would be better to do this in batches!
		locQuery = client.query(
			"SELECT
				HZBO_STADT as 'name',
				HZBO_BUNDESLAND as 'federal_state',
				HZBO_STAAT as 'country',
				HZBO_ID as 'data_warehouse_id'
			FROM DIM_HZBORTE")

		numAll = locQuery.each.length
		print "got #{numAll} locations, now iterating and creating missing ones\n"

		locations = Hash.new
		numDone = 0
		numNewLocations = 0
		numNewCountries = 0
		numNewFedStates = 0
		print "         50%v       100%v\n"
		step = numAll / 25
		locQuery.each do |location|
			if(((numDone += 1) % step) == 0)
				print "*"
			end

			locationDB = Location.find_by_data_warehouse_id(location["data_warehouse_id"])
			if(locationDB == nil)
			
				country = Country.find_by_name(location["country"])

				if(country == nil)
					#If we could not find the country we have to create it
					country = Country.new
					country.name = location["country"]
					country.save
					numNewCountries += 1
				end

				if(location["federal_state"] != nil)
					fedState = FederalState.find_by_name(location["federal_state"])
					if(fedState == nil)
						#If we could not find the federal state we have to create it
						fedState = FederalState.new
						fedState.name = location["federal_state"]
						fedState.save
						numNewFedStates += 1
					end
				end

				if(location["name"]==nil)
					location["name"] = "Ausland"
				end


				locationDB = Location.new
				locationDB.federal_state = fedState
				locationDB.country = country
				locationDB.data_warehouse_id = location["data_warehouse_id"]
				locationDB.name = location["name"]

				locationDB.save
				numNewLocations += 1
			end

			locations[location["data_warehouse_id"]] = locationDB
		end
		print "\ndone. Created:"
		print "\n#{numNewLocations} new "+"location".pluralize(numNewLocations)
		print "\n#{numNewCountries} new "+"country".pluralize(numNewCountries)
		print "\n#{numNewFedStates} new federal "+"state".pluralize(numNewFedStates)
		print "\n"
		return locations
	end
end