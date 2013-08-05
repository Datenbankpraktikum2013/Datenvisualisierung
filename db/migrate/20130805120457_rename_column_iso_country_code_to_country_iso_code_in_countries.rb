class RenameColumnIsoCountryCodeToCountryIsoCodeInCountries < ActiveRecord::Migration
  def chang
  	rename_column :countries, :iso_country_code, :country_iso_code
  end
end
