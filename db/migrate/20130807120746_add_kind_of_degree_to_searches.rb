class AddKindOfDegreeToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :kind_of_degree, :string
  end
end
