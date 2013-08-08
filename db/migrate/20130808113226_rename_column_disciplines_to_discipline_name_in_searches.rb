class RenameColumnDisciplinesToDisciplineNameInSearches < ActiveRecord::Migration
  def change
  	rename_column :searches, :disciplines, :discipline_name
  end
end
