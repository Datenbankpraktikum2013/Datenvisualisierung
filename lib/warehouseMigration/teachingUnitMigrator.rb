require File.expand_path('./lib/warehouseMigration/migrator.rb')
module Migrator
	def self.migrateTeachingUnits
		print "\n++++++++++++++++++++++++++++++\n"
		print "+Now migrating teaching units+\n"
		print "++++++++++++++++++++++++++++++\n\n"

		print "retrieving teaching units from datawarehouse\n"
		teaching_units= CLIENT.query(
			"SELECT *
			FROM(
				SELECT DISTINCT
					STF_FBID AS dpt_number,
					STF_FBLTXT dpt_name,
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
					STF_FBID AS dpt_number,
					STF_FBLTXT dpt_name,
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

		numAll = teaching_units.length

		print "got #{numAll} teaching units from datawarehouse\n"
		print "now iterating over them and creating missing ones\n"
		bar = LoadingBar.new(numAll)
		numCreated = 0
		teaching_units.each do |teaching_unit|	
			bar.next
			teaching_unit["dpt_name"].strip!
			teaching_unit["teaching_unit_name"].strip!

			teaching_unitDB = TeachingUnit.find_by_teaching_unit_name(teaching_unit["teaching_unit_name"])

			if (teaching_unitDB == nil)

				teaching_unitDB = TeachingUnit.new
				teaching_unitDB.teaching_unit_name = teaching_unit["teaching_unit_name"]


				teaching_unitDB.department = Department.find_by_department_number(teaching_unit["dpt_number"])
				if(teaching_unitDB.department == nil)
					raise "Could not find department #{teaching_unit["dpt_name"]} with number #{teaching_unit["dpt_number"]} for teaching unit #{teaching_unit["teaching_unit_name"]}!\nMigrate departments first.\nIf error persists blame secretary."
				end
				teaching_unitDB.save
				numCreated += 1
			end

		end
		bar.end
		print "done. Created #{numCreated} missing teaching "
		print "unit".pluralize(numCreated)
		print "\n"
	end
end