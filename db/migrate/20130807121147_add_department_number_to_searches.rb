class AddDepartmentNumberToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :department_number, :string
  end
end
