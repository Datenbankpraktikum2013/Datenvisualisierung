class AddGroupingToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :grouping, :string
  end
end
