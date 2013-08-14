require File.expand_path('./lib/warehouseMigration/migrator.rb')
module Migrator
	def self.migrateDegrees
		print "\n+++++++++++++++++++++++\n"
		print "+now migrating degrees+\n"
		print "+++++++++++++++++++++++\n\n"

		print "preload all disciplines\n"

		print "calculating number of batches\n"

		#To use floor here is okay because limit starts with 0
		allbatches = CLIENT.query(
			"SELECT
				floor(count(LAB_MTKNR)/#{BATCHSIZE}) as batches
			FROM(
				SELECT DISTINCT
					LAB_MTKNR,
					LAB_STGNR,
					LAB_PNOTE
				FROM 
					FKT_LAB
				JOIN (
					SELECT
						LAB_MTKNR AS MATNR,
						LAB_STGNR AS STGNR,
						MAX(LAB_PSEM) AS PSEM,
						MAX(LAB_LABNR) AS LABNR
					FROM
						FKT_LAB
					WHERE
						LAB_PSTATUS IN (\"BE\",\"PA\")
					GROUP BY
						MATNR,
						STGNR
				) AS BLA
				ON
					LAB_MTKNR = MATNR AND
					LAB_STGNR = STGNR AND
					LAB_PSEM = PSEM AND
					LAB_LABNR = LABNR
			) AS BLUBB").first["batches"]

		print "loading degrees in #{allbatches} batches of #{BATCHSIZE} study entries\n"
		allbatches = 1
		for batchnumber in 0..allbatches 
			print "retrieving batch #{batchnumber+1} of #{allbatches+1}\n"
			
			degrees = CLIENT.query(
				"SELECT
					LAB_MTKNR AS matriculation_number,
					LAB_STGNR AS study_number,
					LAB_PNOTE AS grade,
					LAB_STGSEM AS number_of_semesters
				FROM 
					FKT_LAB
				JOIN (
					SELECT
						LAB_MTKNR AS MATNR,
						LAB_STGNR AS STGNR,
						MAX(LAB_PSEM) AS PSEM,
						MAX(LAB_LABNR) AS LABNR
					FROM
						FKT_LAB
					WHERE
						LAB_PSTATUS IN (\"BE\",\"PA\")
					GROUP BY
						MATNR,
						STGNR
				) AS BLA
				ON
					LAB_MTKNR = MATNR AND
					LAB_STGNR = STGNR AND
					LAB_PSEM = PSEM AND
					LAB_LABNR = LABNR
				GROUP BY
					LAB_MTKNR,
					LAB_STGNR
				ORDER BY
					matriculation_number ASC
				LIMIT
					#{batchnumber*BATCHSIZE},#{BATCHSIZE}").each
			numAll = degrees.length

			print "now preloading students\n"
			minMat = degrees.first["matriculation_number"]
			maxMat = degrees.last["matriculation_number"]
			studentBatches = Student.connection.execute("select COUNT(*) from students where matriculation_number between #{minMat} and #{maxMat} order by matriculation_number asc").first[0].to_i / BATCHSIZE
			studentBatchCount = 0
			record = Student.includes(studies: [:degree]).where("matriculation_number between #{minMat} and #{maxMat}").order("matriculation_number ASC")
			studentHash = loadStudents(record,0)

			print "now iterating over the batch and creating missing degrees\n"
			
			degreesToSave = Array.new
			numCreated = 0
			bar = LoadingBar.new(numAll)

			#Create all the degrees if necessary
			degrees.each do |degree|
				bar.next
				
				matriculation_number = degree.delete("matriculation_number")
				study_number = degree.delete("study_number").to_i
				studentDB = nil
				if(studentHash.has_key?(matriculation_number))
					studentDB = studentHash[matriculation_number][:student]
				elsif((studentBatchCount < studentBatches) and (matriculation_number > studentHash.max[0]))
					studentBatchCount += 1
					studentHash = loadStudents(record,studentBatchCount)
					if(studentHash.has_key?(matriculation_number))
						studentDB = studentHash[matriculation_number][:student]
					end
				else
					studentDB = Student.includes(studies: [:degree]).find_by_matriculation_number(matriculation_number)
					unless studentDB == nil
						studentHash[matriculation_number] = {student:studentDB,studies:{}}
						studentDB.studies.each do |studentStudy|
							studentHash[matriculation_number][:studies][studentStudy.study_number] = studentStudy
						end
					end
				end

				if(studentDB == nil)
					next
					#raise "Student #{matriculation_number} was not yet migrated. Please migrate students first.\n"
				end

				studyDB = studentHash[matriculation_number][:studies][study_number]
				if(studyDB == nil)
					next
					#raise "Study #{study_number} for student #{matriculation_number} was not yet migrated. Please migrate studies first."
				end

				number_of_semesters = degree["number_of_semesters"]
				semDereg = studyDB.semester_of_matriculation
				semDereg += (number_of_semesters / 2) * 10
				semDereg += number_of_semesters % 2
				addition = semDereg % 10
				if(addition == 0)
					addition = -8
				elsif(addition == 3)
					addition = 8
				end
				semDereg += addition
				degree["semester_of_deregistration"] = semDereg

				if(studyDB.degree == nil)
					degreeDB = Degree.new(degree)
					numCreated += 1
					degreesToSave << [degreeDB,studyDB]

				#update if current entry is newer
				elsif(studyDB.degree.semester_of_deregistration<semDereg)
					studyDB.degree.assign_attributes(degree)
					degreesToSave << [studyDB.degree,nil]
				end
			end
			bar.end
			print "\ndone. Created #{numCreated} new "+"degree".pluralize(numCreated)+"\n"

			if(numCreated > 0)
				print "now saving them\n"
				bar = LoadingBar.new(degreesToSave.length)
				Degree.transaction do
					degreesToSave.each do |entry|
						bar.next
						degree = entry.first
						study = entry.last
						unless study == nil
							study.degree = degree
							study.save
						end
						degree.save
					end
					bar.end
				end
				print "done\n"
			end
		end
	end
	def self.loadStudents(record,batchnumber)
		students = record.limit(BATCHSIZE).offset(BATCHSIZE*batchnumber).load
		studentHash = {}
		students.each do |student|
			studyHash = {student:student,studies:{}}
			student.studies.each do |study|
				studyHash[:studies][study.study_number] = study
			end
			studentHash[student.matriculation_number] = studyHash
		end
		return studentHash
	end
end