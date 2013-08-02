class AddLatitudeToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :latitude, :float
  end
end
