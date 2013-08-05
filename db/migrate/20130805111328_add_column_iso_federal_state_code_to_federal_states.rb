class AddColumnIsoFederalStateCodeToFederalStates < ActiveRecord::Migration
  def change
    add_column :federal_states, :iso_federal_state_code, :string
  end
end
