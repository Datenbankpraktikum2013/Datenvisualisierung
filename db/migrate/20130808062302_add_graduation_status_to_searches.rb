class AddGraduationStatusToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :graduation_status, :string
  end
end
