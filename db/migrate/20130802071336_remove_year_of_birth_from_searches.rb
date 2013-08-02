class RemoveYearOfBirthFromSearches < ActiveRecord::Migration
  def change
  	remove_column :searches, :year_of_birth
  end
end
