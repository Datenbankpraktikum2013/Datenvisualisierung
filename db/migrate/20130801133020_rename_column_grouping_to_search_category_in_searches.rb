class RenameColumnGroupingToSearchCategoryInSearches < ActiveRecord::Migration
  def change
  	rename_column :searches, :grouping, :search_category
  end
end
