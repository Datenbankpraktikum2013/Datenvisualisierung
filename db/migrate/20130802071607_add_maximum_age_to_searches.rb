class AddMaximumAgeToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :maximum_age, :integer
  end
end
