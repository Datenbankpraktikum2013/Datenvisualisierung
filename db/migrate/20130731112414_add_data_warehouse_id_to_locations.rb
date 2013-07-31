class AddDataWarehouseIdToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :data_warehouse_id, :string
  end
end
