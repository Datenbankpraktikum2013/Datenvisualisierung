class AddFederalStateIdToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :federal_state_id, :integer
  end
end
