class AddLocationNameToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :location_name, :string
  end
end
