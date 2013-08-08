class AddDataWarehouseIdToDisciplines < ActiveRecord::Migration
  def change
    add_column :disciplines, :data_warehouse_id, :string
  end
end
