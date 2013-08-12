class AddLocationIndexToStudents < ActiveRecord::Migration
  def self.up
  	add_index :students, [:id, :location_id]
  end

  def self.down
  	remove_index :students, [:id, :location_id]
  end
end
