class RenameColumnNameToCountryNameInCountries < ActiveRecord::Migration
  def change
  	rename_column :countries, :name, :country_name
  end
end
