class AddColumnLatitudeToCountries < ActiveRecord::Migration
  def change
    add_column :countries, :latitude, :float
  end
end
