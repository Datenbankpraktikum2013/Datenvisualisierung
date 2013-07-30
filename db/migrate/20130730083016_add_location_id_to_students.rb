class AddLocationIdToStudents < ActiveRecord::Migration
  def change
    add_column :students, :location_id, :integer
  end
end
