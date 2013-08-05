class RenameColumnNameToFederalStateNameInFederalStates < ActiveRecord::Migration
  def change
    rename_column :federal_states, :name, :federal_state_name
  end
end
