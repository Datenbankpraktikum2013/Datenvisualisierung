class RenameColumnNameToDepartmentNameInDepartments < ActiveRecord::Migration
  def change
  	rename_column :departments, :name, :department_name
  end
end
