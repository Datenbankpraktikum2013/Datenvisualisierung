class AddTeachingUnitNameToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :teaching_unit_name, :string
  end
end
