class AddIndexToLocation < ActiveRecord::Migration
  def self.up
    add_index :locations, :data_warehouse_id
  end

  def self.down
    remove_index :locations, :column => :data_warehouse_id
  end
end
