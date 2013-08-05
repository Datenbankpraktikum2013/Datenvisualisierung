module Migrator

	BATCHSIZE = 10000

	CSV_PATH = "db/warehouseRealWorldMapping.csv"

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
		
		print "\n++++++++++++++++++++++++"
		print "\n+now migrating students+"
		print "\n++++++++++++++++++++++++"
		print "\n\n"

		print "preload all locations\n"
		locations = Hash.new
		Location.all.each do |location|
			locations[location["data_warehouse_id"]] = location
		end
		print "done loading #{locations.length} locations\n"


		print "loading students in batches of #{BATCHSIZE}\n"

		#To use floor here is okay, look at the next query and you'll see why.
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
			numCreated = 0
			bar = LoadingBar.new(numAll)
			#Create all the students
			students.each do |student|
				bar.next
				
				#Delete HZBOrt from hash so that we can use it to create the student
				hzbOrt = student.delete("HZBOrt")

				studentDB = Student.find_by_matriculation_number(student["matriculation_number"])
				if(studentDB == nil)
					studentDB = Student.new(student)
					numCreated += 1
					studentDB.location = locations[hzbOrt]
					if(studentDB.location == nil)
						raise "Could not find location with warehouse ID #{hzbOrt} for Student with number #{studentDB.matriculation_number}!\nMigrate locations first.\nIf error persists blame secretary."
					end
					dBstudents.insert(0,studentDB)
				end
			
				#Get study fields for Student
				#fieldIDs = CLIENT.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE STG_MATRIKELNR = '#{studentDB.id}'")
				#studentMap[studentDB] = fieldIDs
			end
			print "\n done. Created #{numCreated} new "+"student".pluralize(numCreated)+"\n"

			if(numCreated > 0)
				print "now saving them\n"
				bar = LoadingBar.new(numCreated)
				Student.transaction do
					dBstudents.each do |student|
						bar.next
						student.save
					end
					bar.end
				end
				print "done\n"
			end
		end
	end

	#Dumb creation of all not yet existing locations with
	#their countries and federal states if exitend

	#It is not checked wheter information has changed or not!!!
	def self.migrateLocations
		print "\n+++++++++++++++++++++++++"
		print "\n+Now migrating locations+"
		print "\n+++++++++++++++++++++++++\n"

		print "\nretrieving mapperfile"
		nameMapper = Hash.new
		CSV.foreach(File.expand_path(CSV_PATH)) do |row|
			nameMapper[row[0]] = row[2]
		end

		print "\nretrieving locations"

		#Here the whole table is loaded into memory
		#Would be better to do this in batches!
		locQuery = CLIENT.query(
			"SELECT
				HZBO_STADT as 'location_name',
				HZBO_BUNDESLAND as 'federal_state_name',
				HZBO_STAAT as 'country_name',
				HZBO_ID as 'data_warehouse_id'
			FROM DIM_HZBORTE")

		numAll = locQuery.each.length
		print "\ngot #{numAll} locations from datawarehouse"
		print "\nnow iterating over them and creating missing ones\n"

		numDone = 0
		numNewLocations = 0
		numNewCountries = 0
		numNewFedStates = 0
		bar = LoadingBar.new(numAll)
		unknownLocations = Array.new

		locQuery.each do |location|
			bar.next

			locationDB = Location.find_by_data_warehouse_id(location["data_warehouse_id"])
			if(locationDB == nil)
				location["country_name"].strip!
				location["federal_state_name"].strip!

				country = Country.find_by_name(location["country_name"])

				if(country == nil)
					#If we could not find the country we have to create it
					country = Country.new
					country.country_name = location["country_name"]
					country.save
					numNewCountries += 1
				end

				if(location["federal_state_name"] != nil)
					fedState = FederalState.find_by_name(location["federal_state_name"])
					if(fedState == nil)
						#If we could not find the federal state we have to create it
						fedState = FederalState.new
						fedState.federal_state_name = location["federal_state_name"]
						fedState.save
						numNewFedStates += 1
					end
				end

				locationDB = Location.new

				if(location["location_name"]==nil)
					location["location_name"] = "Ausland"
				else
					location["location_name"].slice!(/\(.*/)
					location["location_name"].strip!
					name = location["location_name"]

					if(nameMapper.hasKey?(name))
						result = Geocoder.search("#{nameMapper[name]},#{fedState.federal_state_name}").first
					else
						result = Geocoder.search("#{name},#{fedState.federal_state_name}").first
					end
					sleep 0.25
					if(result == nil)
						unknownLocations.insert(-1,[name,fedState.federal_state_name])
					else
						locationDB.longitude = result.longitude
						locationDB.latitude = result.latitude
					end
				end

				locationDB.data_warehouse_id = location["data_warehouse_id"]
				locationDB.location_name = location["location_name"]
				locationDB.federal_state = fedState
				locationDB.country = country

				locationDB.save
				numNewLocations += 1
			end
		end
		bar.end
		length = unknownLocations.length
		if(length>0)
			if(length == 1)
				print "\nthere was one location that could not be found"
			else
				print "\nthere were #{length} locations that could not be found"
			end
			print "\nplease add the missing information to #{CSV_PATH}"

			CSV.open(File.expand_path(CSV_PATH), "wb") do |csv|
				csv.eof
				unknownLocations.each do |value|
					csv << [value[0],value[1],"?"]
				end
			end
		end
		print "\ndone. Created:"
		print "\n#{numNewLocations} new "+"location".pluralize(numNewLocations)
		print "\n#{numNewCountries} new "+"country".pluralize(numNewCountries)
		print "\n#{numNewFedStates} new federal "+"state".pluralize(numNewFedStates)
		print "\n"
	end

	def self.migrateDepartments
		print "\n+++++++++++++++++++++++++++"
		print "\n+Now migrating departments+"
		print "\n+++++++++++++++++++++++++++\n"

		# the field STF_ASTAT_GRLTXT contains both, the number and the name of the department. therefore it will be put first in to 'name' and than later separated
		# looks like this 

		print "\nretrieving departments from datawarehouse"
		departments = CLIENT.query(
			"SELECT DISTINCT
				STF_ASTAT_GRLTXT as 'department_name'
			FROM DIM_STUDIENFAECHER")

		numAll = departments.each.length
		print "\ngot #{numAll} departments from datawarehouse"
		print "\nnow iterating over them and creating missing ones\n"

		bar = LoadingBar.new(numAll)
		numCreated = 0
		departments.each do |department|
			bar.next
			if(department["department_name"] == nil )
				# if the name is null, this means, it is "Interdisziplinär" and we have to set it manually
				departmentDB = Department.find_by_number(100)
				if(departmentDB == nil)
					departmentDB = Department.new
					departmentDB.department_name = "Interdisziplinär"
					departmentDB.number = 100
					departmentDB.save
					numCreated += 1
				end
			
			else
				departmentDB = Department.find_by_number(department["department_name"].from(0).to(1))
				if(departmentDB == nil)

					departmentDB = Department.new 
					departmentDB.number = department["department_name"].from(0).to(1)
					departmentDB.department_name = department["department_name"].from(3).to(-1)
					departmentDB.save
					numCreated += 1
				end
			end

		end
		bar.end
		print "\ndone. Created #{numCreated} missing"
		print "department".pluralize(numCreated)

	end

	def self.migrateTeachingUnits
		print "\n++++++++++++++++++++++++++++++"
		print "\n+Now migrating teaching units+"
		print "\n++++++++++++++++++++++++++++++\n"

		teaching_units = CLIENT.query(
			"SELECT DISTINCT substring( STF_ASTAT_GRLTXT, 1, 2 ) AS number,substring(STF_ASTAT_GRLTXT,4)as dpt_name, LE_DTXT AS teaching_unit_name
			FROM DIM_STUDIENFAECHER
			JOIN DIM_ABSTGLE ON DIM_STUDIENFAECHER.STF_ID = DIM_ABSTGLE.ABSTG_STG
			JOIN DIM_LEHREINH ON DIM_ABSTGLE.ABSTG_LEHREINH = DIM_LEHREINH.LE_ID")


		teaching_units.each do |teaching_unit|	
			teaching_unit["teaching_unit_name"].strip!

			teaching_unitDB = TeachingUnit.find_by_name(teaching_unit["teaching_unit_name"])

			if (teaching_unitDB == nil)

				teaching_unitDB = TeachingUnit.new
				teaching_unitDB.teaching_unit_name = teaching_unit["teaching_unit_name"]


				teaching_unitDB.department = Department.find_by_number(teaching_unit["number"])
				if(teaching_unitDB.department == nil)
					raise "Could not find department #{teaching_unit["dpt_name"]} with number #{teaching_unit["number"]} for teaching unit #{teaching_unit["teaching_unit_name"]}!\nMigrate departments first.\nIf error persists blame secretary."
				end
				teaching_unitDB.save

			end

		end	

	end

	def self.migrateDisciplines
		print "\n+++++++++++++++++++++++++++"
		print "\n+Now migrating disciplines+"
		print "\n+++++++++++++++++++++++++++\n"

		disciplines = CLIENT.query(
			"SELECT DISTINCT STF_LTXT as discipline_name,LE_DTXT AS teaching_unit_name
			FROM DIM_STUDIENFAECHER
			JOIN DIM_ABSTGLE ON DIM_STUDIENFAECHER.STF_ID = DIM_ABSTGLE.ABSTG_STG
			JOIN DIM_LEHREINH ON DIM_ABSTGLE.ABSTG_LEHREINH = DIM_LEHREINH.LE_ID")


		disciplines.each do |discipline|	
			discipline["discipline_name"].strip!

			disciplineDB = Discipline.find_by_name(discipline["discipline_name"])
			if (disciplineDB == nil)
				disciplineDB = Discipline.new
				disciplineDB.discipline_name = discipline["discipline_name"]

				disciplineDB.teaching_unit = TeachingUnit.find_by_teaching_unit_name(discipline["teaching_unit_name"])
				if(disciplineDB.teaching_unit == nil)
					raise "Could not find teaching unit #{discipline["teaching_unit_name"]} for discipline #{discipline["discipline_name"]}!\nMigrate teaching units first.\nIf error persists blame secretary."
				end
				disciplineDB.save
			end

		end	

	end
	class LoadingBar

		def initialize(datasize = 100, barLength = 25, barsign="*")
			if(barLength <= 0)
				raise "BarLength may not be smaller than 1!"
			end
			if(datasize <= 0)
				datasize = 1
			end
			@stepSize = (barLength*1.0)/datasize

			@barsign = barsign
			@barLength = barLength
			@printedSigns = 0.0
			@nextCount = 0
			@datasize = datasize
			@ended = false

			if(barLength>10)
				barString = " "*((barLength+1)/2 - 4)
				barString += "50%"
				if(barLength%2 == 0)
					barString += "\\/"
				else
					barString += "V"
				end
				barString += " "*((barLength/2) - 6 + (barLength%2))
			elsif(barLength>4)
				barString = " "*(barLength-5)
			end

			if(barLength>4)
				barString += "100%V"
			elsif(barLength>0)
				barString = " "*(barLength-1)
				barString += "V"
			end

			print "\n"
			print barString
			print "\n"
		end

		def next

			if(@nextCount > @datasize)
				return false
			else
				newlength = @nextCount*@stepSize
				lengthDif = newlength - @printedSigns
				if(lengthDif >= 1)
					print @barsign*lengthDif
					@printedSigns += lengthDif
					@printedSigns -= lengthDif%1
				end
				
			end
			if(@nextCount == @datasize)
				print "\n"
				@printedSigns = @barLength
				@nextCount += 1
				@ended = true
				return false
			end
			@nextCount += 1
			return true
		end

		def end
			unless @ended
				print @barsign*(@barLength-@printedSigns)
				print "\n"
				@ended = true
			end
		end
	end
end