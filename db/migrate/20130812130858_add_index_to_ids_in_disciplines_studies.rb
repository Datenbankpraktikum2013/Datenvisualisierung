class AddIndexToIdsInDisciplinesStudies < ActiveRecord::Migration
  def self.up
  	add_index :disciplines_studies, [:discipline_id, :study_id]
  end

  def self.down
  	remove_index :disciplines_studies, [:discipline_id, :study_id]
  end
end
