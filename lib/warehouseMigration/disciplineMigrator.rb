module Migrator
	def self.migrateDisciplines
		print "\n+++++++++++++++++++++++++++\n"
		print "+Now migrating disciplines+\n"
		print "+++++++++++++++++++++++++++\n\n"

		print "retrieving disciplines units from datawarehouse\n"
		disciplines = CLIENT.query(
			"SELECT DISTINCT STF_LTXT as discipline_name,LE_DTXT AS teaching_unit_name
			FROM DIM_STUDIENFAECHER
			JOIN DIM_ABSTGLE ON DIM_STUDIENFAECHER.STF_ID = DIM_ABSTGLE.ABSTG_STG
			JOIN DIM_LEHREINH ON DIM_ABSTGLE.ABSTG_LEHREINH = DIM_LEHREINH.LE_ID")


		numAll = disciplines.each.length

		print "got #{numAll} disciplines from datawarehouse\n"
		print "now iterating over them and creating missing ones\n"
		bar = LoadingBar.new(numAll)
		numCreated = 0
		disciplines.each do |discipline|	
			discipline["discipline_name"].strip!
			discipline["teaching_unit_name"].strip!

			disciplineDB = Discipline.find_by_discipline_name(discipline["discipline_name"])
			if (disciplineDB == nil)
				disciplineDB = Discipline.new
				disciplineDB.discipline_name = discipline["discipline_name"]

				disciplineDB.teaching_unit = TeachingUnit.find_by_teaching_unit_name(discipline["teaching_unit_name"])
				if(disciplineDB.teaching_unit == nil)
					raise "Could not find teaching unit #{discipline["teaching_unit_name"]} for discipline #{discipline["discipline_name"]}!\nMigrate teaching units first.\nIf error persists blame secretary."
				end
				disciplineDB.save
				numCreated += 1
			end

		end
		bar.end
		print "done. Created #{numCreated} missing "
		print "discipline".pluralize(numCreated)
		print "\n"
	end
end