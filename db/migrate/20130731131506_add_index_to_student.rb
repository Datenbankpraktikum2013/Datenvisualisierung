class AddIndexToStudent < ActiveRecord::Migration
  def self.up
    add_index :students, :matriculation_number
  end

  def self.down
    remove_index :students, :column => :matriculation_number
  end
end
