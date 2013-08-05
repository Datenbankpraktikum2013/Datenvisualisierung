class AddColumnLatitudeToFederalStates < ActiveRecord::Migration
  def change
    add_column :federal_states, :latitude, :float
  end
end
