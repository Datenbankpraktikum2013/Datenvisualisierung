class AddColumnNumberOfSemesterToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :number_of_semester, :integer
  end
end
