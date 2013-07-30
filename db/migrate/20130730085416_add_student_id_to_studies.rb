class AddStudentIdToStudies < ActiveRecord::Migration
  def change
    add_column :studies, :student_id, :integer
  end
end
