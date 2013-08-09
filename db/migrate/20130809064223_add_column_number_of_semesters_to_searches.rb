class AddColumnNumberOfSemestersToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :number_of_semesters, :integer
  end
end
