require File.expand_path('./lib/warehouseMigration/migrator.rb')
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
			"SELECT
				floor(count(STG_MATRIKELNR)/#{BATCHSIZE}) as batches
			FROM
				(SELECT DISTINCT STG_MATRIKELNR
				FROM
					#{QUERY_LAST_STUDENT_INFO}
				) AS STUD").first["batches"]
		
		for batchnumber in 0..allbatches
			print "retrieving batch #{batchnumber+1} of #{allbatches+1}\n"

			students = CLIENT.query(
				"SELECT
					STG_MATRIKELNR AS 'matriculation_number',
					STG_GEBJAHR AS 'year_of_birth',
					STG_GESCHLECHT AS 'gender',
					STG_STAATSANGH AS 'nationality',
					STG_HZBORT AS 'HZBOrt'
				FROM 
					#{QUERY_LAST_STUDENT_INFO}
				GROUP BY
					STG_MATRIKELNR
				ORDER BY
					STG_MATRIKELNR ASC
				LIMIT
					#{batchnumber*BATCHSIZE},#{BATCHSIZE}
				").each

			numAll = students.length

			minMat = students.first["matriculation_number"]
			maxMat = students.last["matriculation_number"]
			print "now preloading and building hash for students\n"
			studentHash = {}
			Student.where("matriculation_number between #{minMat} and #{maxMat}").each do |student|
				studentHash[student["matriculation_number"]] = student
			end
			print "now iterating over the batch and creating missing students\n"
			
			studentsToSave = Array.new
			numCreated = 0
			bar = LoadingBar.new(numAll)
			#Create all the students
			students.each do |student|
				bar.next
				
				#Delete HZBOrt from hash so that we can use it to create the student
				hzbOrt = student.delete("HZBOrt")

				studentDB = studentHash[student["matriculation_number"]]
				if(studentDB == nil)
					studentDB = Student.find_by_matriculation_number(student["matriculation_number"])
				end
				if(studentDB == nil)
					studentDB = Student.new(student)
					numCreated += 1
					studentDB.location = locations[hzbOrt]
					if(studentDB.location == nil)
						raise "Could not find location with warehouse ID #{hzbOrt} for Student with number #{studentDB.matriculation_number}!\nMigrate locations first and don't forget to check #{CSV_PATH}!\nIf error persists blame secretary."
					end
					studentsToSave.insert(0,studentDB)
				end
			
			end
			print "\ndone. Created #{numCreated} new #{"student".pluralize(numCreated)}\n"

			if(numCreated > 0)
				print "now saving them\n"
				bar = LoadingBar.new(numCreated)
				Student.transaction do
					studentsToSave.each do |student|
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