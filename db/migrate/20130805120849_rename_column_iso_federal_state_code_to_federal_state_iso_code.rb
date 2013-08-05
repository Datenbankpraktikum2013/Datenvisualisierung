class RenameColumnIsoFederalStateCodeToFederalStateIsoCode < ActiveRecord::Migration
  def change
  	rename_column :federal_states, :iso_federal_state_code, :federal_state_iso_code
  end
end
