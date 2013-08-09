class AddColumnSemesterOfDeregistrationToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :semester_of_deregistration, :integer
  end
end
