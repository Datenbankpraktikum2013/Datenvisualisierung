class AddIndexToTeachingUnitIdInDisciplines < ActiveRecord::Migration
  def self.up
  	add_index :disciplines, :teaching_unit_id
  end

  def self.down
  	remove_index :disciplines, :teaching_unit_id
  end
end
