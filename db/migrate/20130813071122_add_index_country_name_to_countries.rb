class AddIndexCountryNameToCountries < ActiveRecord::Migration
  def self.up
  	add_index :countries, :country_name
  end

  def self.down
  	remove_index :countries, :country_name
  end
end
