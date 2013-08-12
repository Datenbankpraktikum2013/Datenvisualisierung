class AddIndexesToLocations < ActiveRecord::Migration
  def self.up
  	add_index :locations, :country_id
  	add_index :locations, :federal_state_id
  end

  def self.down
  	remove_index :locations, :country_id
  	remove_index :locations, :federal_state_id
  end
end
