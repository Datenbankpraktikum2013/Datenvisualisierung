class AddIndexToDisciplinesOnDataWarehouseId < ActiveRecord::Migration
  def self.up
    add_index :disciplines, :data_warehouse_id
  end

  def self.down
    remove_index :disciplines, :column => :data_warehouse_id
  end
end
