require File.expand_path('./lib/warehouseMigration/migrator.rb')
module Migrator
	def self.migrateDepartments
		print "\n+++++++++++++++++++++++++++\n"
		print "+Now migrating departments+\n"
		print "+++++++++++++++++++++++++++\n\n"

		# the field STF_ASTAT_GRLTXT contains both, the number and the name of the department. therefore it will be put first in to 'name' and than later separated
		# looks like this 

		print "retrieving departments from datawarehouse\n"
		departments = CLIENT.query(
			"SELECT DISTINCT
				STF_FBID AS department_number,
				STF_FBLTXT AS department_name
			FROM DIM_STUDIENFAECHER")

		numAll = departments.each.length
		print "got #{numAll} departments from datawarehouse\n"
		print "now iterating over them and creating missing ones\n"

		bar = LoadingBar.new(numAll)
		numCreated = 0
		departments.each do |department|
			bar.next
			if(department["department_name"] == nil )
				# if the name is null, this means, it is "Interdisziplinär" and we have to set it manually
				departmentDB = Department.find_by_department_number(100)
				if(departmentDB == nil)
					departmentDB = Department.new
					departmentDB.department_name = "Interdisziplinär"
					departmentDB.department_number = 100
					departmentDB.save
					numCreated += 1
				end
			
			else
				department["department_name"].strip!
				departmentDB = Department.find_by_department_number(department["department_number"])
				if(departmentDB == nil)

					departmentDB = Department.new 
					departmentDB.department_number = department["department_number"]
					departmentDB.department_name = department["department_name"]
					departmentDB.save
					numCreated += 1
				end
			end

		end
		bar.end
		print "done. Created #{numCreated} missing "
		print "department".pluralize(numCreated)
		print "\n"

	end
end