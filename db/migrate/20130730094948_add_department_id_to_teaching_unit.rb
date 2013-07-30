class AddDepartmentIdToTeachingUnit < ActiveRecord::Migration
  def change
    add_column :teaching_units, :department_id, :integer
  end
end
