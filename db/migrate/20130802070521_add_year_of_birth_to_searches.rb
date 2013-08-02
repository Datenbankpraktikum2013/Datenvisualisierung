class AddYearOfBirthToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :year_of_birth, :integer
  end
end
