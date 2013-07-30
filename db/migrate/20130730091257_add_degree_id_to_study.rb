class AddDegreeIdToStudy < ActiveRecord::Migration
  def change
    add_column :studies, :degree_id, :integer
  end
end
