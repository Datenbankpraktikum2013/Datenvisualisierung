class AddIndexToDegreeIdInStudies < ActiveRecord::Migration
  def self.up
  	add_index :studies, :degree_id
  end

  def self.down
  	remove_index :studies, :degree_id
  end
end
