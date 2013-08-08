class AddColumnDisciplinesToSearches < ActiveRecord::Migration
  def change
    add_column :searches, :disciplines, :string
  end
end
