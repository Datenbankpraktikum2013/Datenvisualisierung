class AddColumnCountryNameToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :country_name, :string
  end
end
