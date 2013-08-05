class AddColumnIsoCountryCodeToCountries < ActiveRecord::Migration
  def change
    add_column :countries, :iso_country_code, :string
  end
end
