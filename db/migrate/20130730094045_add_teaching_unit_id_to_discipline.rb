class AddTeachingUnitIdToDiscipline < ActiveRecord::Migration
  def change
    add_column :disciplines, :teaching_unit_id, :integer
  end
end
