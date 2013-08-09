module Migrator
	def self.migrateDisciplines
		print "\n+++++++++++++++++++++++++++\n"
		print "+Now migrating disciplines+\n"
		print "+++++++++++++++++++++++++++\n\n"

		print "retrieving disciplines units from datawarehouse\n"
		disciplines = CLIENT.query(
			"SELECT *
			FROM(
				SELECT DISTINCT
					CONCAT(STF_ID, LE_ID) as data_warehouse_id,
					STF_LTXT as discipline_name,
					LE_DTXT AS teaching_unit_name
				FROM
					DIM_STUDIENFAECHER
				JOIN(
					SELECT DISTINCT
						STG_LE,STG_FACH
					FROM
						FKT_STUDIENGAENGE
					)as BLA
				ON
					STF_ID = STG_FACH
				JOIN
					DIM_LEHREINH
				ON
					STG_LE = LE_ID
				UNION
				SELECT DISTINCT
					CONCAT(STF_ID, LE_ID) as data_warehouse_id,
					STF_LTXT as discipline_name,
					LE_DTXT AS teaching_unit_name
				FROM
					DIM_STUDIENFAECHER
				JOIN(
					SELECT DISTINCT
						LAB_LE,LAB_STG
					FROM
						FKT_LAB
					)as BLUBB
				ON
					STF_ID = LAB_STG
				JOIN
					DIM_LEHREINH
				ON
					LAB_LE = LE_ID
			) AS UNI").each


		numAll = disciplines.length

		print "got #{numAll} disciplines from datawarehouse\n"
		print "now iterating over them and creating missing ones\n"
		bar = LoadingBar.new(numAll)
		numCreated = 0
		disciplines.each do |discipline|	
			discipline["discipline_name"].gsub!(/\.\.\./,'') 
			discipline["discipline_name"].strip!

			if (discipline["discipline_name"][0]  == '-' )
				discipline["discipline_name"].slice!(0)
			end

			discipline["teaching_unit_name"].strip!

			disciplineDB = Discipline.find_by_data_warehouse_id(discipline["data_warehouse_id"])
			if (disciplineDB == nil)
				disciplineDB = Discipline.new
				disciplineDB.discipline_name = discipline["discipline_name"]
				disciplineDB.data_warehouse_id = discipline["data_warehouse_id"]

				#Teaching units can be uniquely accessed by name was tested with query "SELECT LE_DTXT, COUNT( LE_ID ) FROM `DIM_LEHREINH` GROUP BY LE_DTXT ORDER BY COUNT( LE_ID ) DESC"
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