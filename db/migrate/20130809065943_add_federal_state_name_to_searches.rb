class AddFederalStateNameToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :federal_state_name, :string
  end
end
