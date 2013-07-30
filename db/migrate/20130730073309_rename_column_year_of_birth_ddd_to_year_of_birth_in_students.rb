class RenameColumnYearOfBirthDddToYearOfBirthInStudents < ActiveRecord::Migration
  def change
  	rename_column :students, :year_of_birthDDD, :year_of_birth
  end
end
