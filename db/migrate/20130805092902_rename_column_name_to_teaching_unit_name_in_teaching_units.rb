class RenameColumnNameToTeachingUnitNameInTeachingUnits < ActiveRecord::Migration
  def change
  	rename_column :teaching_units, :name, :teaching_unit_name
  end
end
