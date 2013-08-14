class RenameColumnCountryNameToCountryIsoCodeInSearches < ActiveRecord::Migration
  def change
  	rename_column :searches, :country_name, :country_iso_code
  end
end
