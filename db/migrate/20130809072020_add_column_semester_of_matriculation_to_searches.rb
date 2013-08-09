class AddColumnSemesterOfMatriculationToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :semester_of_matriculation, :integer
  end
end
