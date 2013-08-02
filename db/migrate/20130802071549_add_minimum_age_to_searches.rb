class AddMinimumAgeToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :minimum_age, :integer
  end
end
