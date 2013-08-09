class AddIndexToLocationIdInStudents < ActiveRecord::Migration
  def self.up
  	add_index :students, :location_id
  end

  def self.down
  	remove_index :students, :location_id
  end
end
