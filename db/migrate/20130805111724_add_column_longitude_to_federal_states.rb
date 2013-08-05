class AddColumnLongitudeToFederalStates < ActiveRecord::Migration
  def change
    add_column :federal_states, :longitude, :float
  end
end
