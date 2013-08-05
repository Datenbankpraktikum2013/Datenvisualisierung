class RenameColumnNameToDisciplineNameInDisciplines < ActiveRecord::Migration
  def change
  	rename_column :disciplines, :name, :discipline_name
  end
end
