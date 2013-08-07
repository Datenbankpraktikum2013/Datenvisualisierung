class AddStudyNumberToStudies < ActiveRecord::Migration
  def change
    add_column :studies, :study_number, :integer
  end
end
