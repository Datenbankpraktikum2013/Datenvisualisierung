class AddIndexToStudentIdInStudies < ActiveRecord::Migration
  def self.up
  	add_index :studies, :student_id
  end

  def self.down
  	remove_index :studies, :student_id
  end
end
