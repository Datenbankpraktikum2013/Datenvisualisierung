class RenameColumnIsoCountryCodeToCountryIsoCodeInCountriesCorrection < ActiveRecord::Migration
  def change
  	rename_column :countries, :iso_country_code, :country_iso_code
  end
end
