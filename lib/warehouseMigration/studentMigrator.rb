module Migrator
	def self.migrateStudents
		
		print "\n++++++++++++++++++++++++\n"
		print "+now migrating students+\n"
		print "++++++++++++++++++++++++\n\n"

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
			print "\ndone. Created #{numCreated} new "+"student".pluralize(numCreated)+"\n"

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
end