class AddIndexesToFederalStates < ActiveRecord::Migration
  def self.up
  	add_index :federal_states, :federal_state_name
  	add_index :federal_states, :federal_state_iso_code
  end

  def self.down
  	remove_index :federal_states, :federal_state_name
  	remove_index :federal_states, :federal_state_iso_code
  end
end
