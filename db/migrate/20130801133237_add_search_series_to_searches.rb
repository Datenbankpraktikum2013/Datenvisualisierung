class AddSearchSeriesToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :search_series, :string
  end
end
