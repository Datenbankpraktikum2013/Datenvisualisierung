class CreateDisciplinesStudies < ActiveRecord::Migration
  def change
    create_table :disciplines_studies, id: false do |t|
    	t.references :discipline, null:false 
    	t.references :study, null: false
    end
  end
end
