class RenameColumnNumberToDepartmentNumberInDepartments < ActiveRecord::Migration
  def change
  	rename_column :departments, :number, :department_number
  end
end
