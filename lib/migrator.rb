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

	
	CLIENT = Mysql2::Client.new(
		:host => "mysql5.serv.uni-osnabrueck.de",
		:username => "sosruntime",
		:password => "soSRuntime",
		:database => "misdb")

	def self.migrateStudents
		
		print "start migrating students\n"

		print "preload all locations\n"
		locations = Hash.new
		Location.all.each do |location|
			locations[location["data_warehouse_id"]] = location
		end
		print "done loading #{locations.length} locations\n"


		print "loading students in batches of #{BATCHSIZE}\n"
		allbatches = CLIENT.query(
			"SELECT floor(count(STG_MATRIKELNR)/#{BATCHSIZE}) as batches
			FROM (#{QUERY_LAST_STUDENT_INFO}) as LI").first["batches"]

		for batchnumber in 0..allbatches
			print "retrieving batch #{batchnumber+1} of #{allbatches+1}\n"

			students = CLIENT.query(
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
				#fieldIDs = CLIENT.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE STG_MATRIKELNR = '#{studentDB.id}'")
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
	def self.migrateLocations
		print "retrieving locations\n"

		#Here the whole table is loaded into memory
		#Would be better to do this in batches!
		locQuery = CLIENT.query(
			"SELECT
				HZBO_STADT as 'name',
				HZBO_BUNDESLAND as 'federal_state',
				HZBO_STAAT as 'country',
				HZBO_ID as 'data_warehouse_id'
			FROM DIM_HZBORTE")

		numAll = locQuery.each.length
		print "got #{numAll} locations, now iterating and creating missing ones\n"

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

		end
		print "\ndone. Created:"
		print "\n#{numNewLocations} new "+"location".pluralize(numNewLocations)
		print "\n#{numNewCountries} new "+"country".pluralize(numNewCountries)
		print "\n#{numNewFedStates} new federal "+"state".pluralize(numNewFedStates)
		print "\n"
	end


	def self.migrateDepartments

		# the field STF_ASTAT_GRLTXT contains both, the number and the name of the department. therefore it will be put first in to 'name' and than later separated
		# looks like this 

		departments = CLIENT.query(
			"SELECT DISTINCT
				STF_ASTAT_GRLTXT as 'name'
			FROM DIM_STUDIENFAECHER ")


		departments.each do |department|


			if(department["name"] == nil )
				# if the name is null, this means, it is "Interdisziplinär" and we have to set is manualy
				departmentDB = Department.find_by_number(100)
				if(departmentDB == nil)
					departmentDB = Department.new
					departmentDB.name = "Interdisziplinär"
					departmentDB.number = 100
					departmentDB.save
				end
			
			else
				departmentDB = Department.find_by_number(department["name"].from(0).to(1))
				if(departmentDB == nil)

					departmentDB = Department.new 
					departmentDB.number = department["name"].from(0).to(1)
					departmentDB.name = department["name"].from(3).to(-1)
					departmentDB.save
					
				end
			end

		end

	end

	def self.migrateTeachingUnits

		teaching_units = CLIENT.query(
			"SELECT DISTINCT  
				`LE_DTXT` AS  'name'
			FROM DIM_LEHREINH")


		teaching_units.each do |teaching_unit|	

			teaching_unitDB = TeachingUnit.find_by_name(teaching_unit["name"])

			# remove white space later

			if (teaching_unitDB == nil)
				teaching_unitDB = TeachingUnit.new
				teaching_unitDB.name = teaching_unit["name"].strip
				teaching_unitDB.save
			end

		end	

	end

	def self.migrateDisciplines

		disciplines = CLIENT.query(
			"SELECT DISTINCT  
				`STF_DTXT`  AS 'name'
			FROM `DIM_STUDIENFAECHER` ")


		disciplines.each do |discipline|	

			disciplineDB = Discipline.find_by_name(discipline["name"])

			if (disciplineDB == nil)
				disciplineDB = Discipline.new
				disciplineDB.name = discipline["name"].strip
				disciplineDB.save
			end

		end	

	end



			


end