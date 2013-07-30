class CreateStudies < ActiveRecord::Migration
  def change
    create_table :studies do |t|
      t.integer :semester_of_matriculation
      t.string :kind_of_degree
      t.integer :number_of_semester

      t.timestamps
    end
  end
end
