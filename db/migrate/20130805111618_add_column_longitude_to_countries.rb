class AddColumnLongitudeToCountries < ActiveRecord::Migration
  def change
    add_column :countries, :longitude, :float
  end
end
