class AddIndexToDepartmentIdInTeachingUnits < ActiveRecord::Migration
  def self.up
  	add_index :teaching_units, :department_id
  end

  def self.down
  	remove_index :teaching_units, :department_id
  end
end
