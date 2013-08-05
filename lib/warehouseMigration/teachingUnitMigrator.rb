module Migrator
	def self.migrateTeachingUnits
		print "\n++++++++++++++++++++++++++++++\n"
		print "+Now migrating teaching units+\n"
		print "++++++++++++++++++++++++++++++\n\n"

		print "retrieving teaching units from datawarehouse\n"
		teaching_units = CLIENT.query(
			"SELECT DISTINCT substring( STF_ASTAT_GRLTXT, 1, 2 ) AS number,substring(STF_ASTAT_GRLTXT,4)as dpt_name, LE_DTXT AS teaching_unit_name
			FROM DIM_STUDIENFAECHER
			JOIN DIM_ABSTGLE ON DIM_STUDIENFAECHER.STF_ID = DIM_ABSTGLE.ABSTG_STG
			JOIN DIM_LEHREINH ON DIM_ABSTGLE.ABSTG_LEHREINH = DIM_LEHREINH.LE_ID")
		numAll = teaching_units.each.length

		print "got #{numAll} teaching units from datawarehouse\n"
		print "now iterating over them and creating missing ones\n"
		bar = LoadingBar.new(numAll)
		numCreated = 0
		teaching_units.each do |teaching_unit|	
			bar.next
			teaching_unit["teaching_unit_name"].strip!

			teaching_unitDB = TeachingUnit.find_by_teaching_unit_name(teaching_unit["teaching_unit_name"])

			if (teaching_unitDB == nil)

				teaching_unitDB = TeachingUnit.new
				teaching_unitDB.teaching_unit_name = teaching_unit["teaching_unit_name"]


				teaching_unitDB.department = Department.find_by_number(teaching_unit["number"])
				if(teaching_unitDB.department == nil)
					raise "Could not find department #{teaching_unit["dpt_name"]} with number #{teaching_unit["number"]} for teaching unit #{teaching_unit["teaching_unit_name"]}!\nMigrate departments first.\nIf error persists blame secretary."
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