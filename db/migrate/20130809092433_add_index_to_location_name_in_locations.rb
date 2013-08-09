class AddIndexToLocationNameInLocations < ActiveRecord::Migration
  def self.up
  	add_index :locations, :location_name
  end

  def self.down
  	remove_index :locations, :location_name
  end
end
