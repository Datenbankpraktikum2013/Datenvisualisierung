class AddCombinedIndexesToLocations < ActiveRecord::Migration
  def self.up
  	add_index :locations, [:id, :country_id]
  	add_index :locations, [:id, :federal_state_id]
  end

  def self.down
  	remove_index :locations, [:id, :country_id]
  	remove_index :locations, [:id, :federal_state_id]
  end
end
