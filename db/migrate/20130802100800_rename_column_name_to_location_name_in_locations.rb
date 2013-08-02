class RenameColumnNameToLocationNameInLocations < ActiveRecord::Migration
  def change
  	rename_column :locations, :name, :location_name
  end
end
