require File.expand_path('./lib/warehouseMigration/migrator.rb')
module Migrator

	DEGREE_MAPPER = {
		1=>"Bachelor",33=>"Bachelor",47=>"Bachelor",82=>"Bachelor",
		94=>"Kein Abschluss",97=>"Kein Abschluss",8=>"Kein Abschluss",
		30=>"Master",58=>"Master",64=>"Master",66=>"Master",88=>"Master",99=>"Master",
		21=>"Lehramt",22=>"Lehramt",23=>"Lehramt",25=>"Lehramt",27=>"Lehramt",40=>"Lehramt",
		2=>"Promotion",6=>"Promotion",
		11=>"Diplom"}
	def self.migrateStudies
		print "\n+++++++++++++++++++++++\n"
		print "+now migrating studies+\n"
		print "+++++++++++++++++++++++\n\n"

		print "preload all disciplines\n"
		disciplineHash = {}
		Discipline.all.each do |discipline|
			disciplineHash[discipline.data_warehouse_id] = discipline
		end

		print "done loading #{Discipline.all.length} disciplines\n"

		print "calculating number of batches"
		#To use floor here is okay, look at the next query and you'll see why.
		allbatches = CLIENT.query(
			"SELECT
				floor(count(STG_MATRIKELNR)/#{BATCHSIZE}) as batches
			FROM
				(SELECT 
					STG_MATRIKELNR
				FROM
					#{QUERY_LAST_FIELD_INFO}
				) as LI").first["batches"]

		print "loading studies in #{allbatches} batches of #{BATCHSIZE} study entries\n"
		for batchnumber in 0..allbatches 
			print "retrieving batch #{batchnumber+1} of #{allbatches+1}\n"
			
			studies = CLIENT.query(
				"SELECT
					STG_MATRIKELNR AS matriculation_number,
					STG_STGNR AS study_number,
					ABINT_ASTAT AS kind_of_degree,
					CONCAT(STG_FACH,STG_LE) AS discipline_data_warehouse_id,
					STG_IMMATSEM AS semester_of_matriculation,
					STG_SEMESTER AS current_semester
				FROM
					#{QUERY_LAST_FIELD_INFO}
				ORDER BY
					matriculation_number ASC
				LIMIT
					#{batchnumber*BATCHSIZE},#{BATCHSIZE}").each
			numAll = studies.length

			print "now preloading students\n"
			minMat = studies.first["matriculation_number"]
			maxMat = studies.last["matriculation_number"]
			students = Student.includes(studies: [:disciplines]).where("matriculation_number between #{minMat} and #{maxMat}")
			print "building hash for students\n"
			studentHash = {}
			students.each do |student|
				studyHash = {:student => student, :studies => {}}
				student.studies.each do |study|
					studyHash[:studies][study.study_number] = study
				end
				studentHash[student.matriculation_number] = studyHash
			end

			print "now iterating over the batch and creating missing studies\n"
			
			studiesToSave = Array.new
			numCreated = 0
			bar = LoadingBar.new(numAll)

			#Create all the studies if necessary
			studies.each do |study|
				bar.next
				
				matriculation_number = study.delete("matriculation_number")

				current_semester = study.delete("current_semester").to_s
				semester_of_matriculation = study["semester_of_matriculation"].to_s

				semdif = current_semester[0..3].to_i - semester_of_matriculation[0..3].to_i
				addition = current_semester[-1].to_i - semester_of_matriculation[-1].to_i
				numsem = 2*semdif+addition
				if(numsem < -1)
					helper = semester_of_matriculation
					semester_of_matriculation = current_semester
					current_semester = semester_of_matriculation
					numsem *= -1
				elsif(numsem == -1)
					semester_of_matriculation = current_semester
					numsem = 0
				end
				study["number_of_semester"] = numsem
				kind_of_degree = DEGREE_MAPPER[study["kind_of_degree"].to_i]
				unless kind_of_degree == nil
					study["kind_of_degree"] = kind_of_degree
				end
				if(studentHash.has_key?(matriculation_number))
					studentDB = studentHash[matriculation_number][:student]
				else
					studentDB = Student.find_by_matriculation_number(matriculation_number)
					unless studentDB == nil
						studentHash[matriculation_number][:student] = studentDB
						studentHash[matriculation_number][:studies] = {}
					end
				end
				if(studentDB == nil)
					raise "Cannot create study for student #{matriculation_number} who does not yet exist. Try to migrate students first.\n"
				end

				discipline_data_warehouse_id = study.delete("discipline_data_warehouse_id")

				disciplineDB = disciplineHash[discipline_data_warehouse_id]
				if(disciplineDB == nil)
					raise "Cannot find the discipline of student #{matriculation_number} with custom ID #{discipline_data_warehouse_id} which is concatenation of STG_FACH and STG_LE.\n Try to migrate disciplines first.\n"
				end
				
				studyDB = studentHash[matriculation_number][:studies][study["study_number"]]
				
				if(studyDB == nil)
					studyDB = Study.new(study)
					studyDB.disciplines << disciplineDB
					numCreated += 1
					studentHash[matriculation_number][:studies][study["study_number"]] = studyDB

					unless(studiesToSave.include?([study,studentDB]))
						studiesToSave << [studyDB,studentDB]
					end
				else
					unless(studyDB.disciplines.include?(disciplineDB))
						studyDB.disciplines << disciplineDB
						unless(studiesToSave.include?([study,nil]))
							studiesToSave << [studyDB,nil]
						end
					end
				end

			end
			print "\ndone. Created #{numCreated} new "+"study".pluralize(numCreated)+"\n"

			if(numCreated > 0)
				print "now saving them\n"
				bar = LoadingBar.new(numCreated)
				Study.transaction do
					studiesToSave.each do |entry|
						bar.next
						study = entry.first
						student = entry.last
						unless student == nil
							student.studies << study
						end
						study.save
					end
					bar.end
				end
				print "done\n"
			end
		end
	end
end