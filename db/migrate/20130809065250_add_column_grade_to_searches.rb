class AddColumnGradeToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :grade, :float
  end
end
