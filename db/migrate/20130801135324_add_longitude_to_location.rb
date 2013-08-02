class AddLongitudeToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :longitude, :float
  end
end
