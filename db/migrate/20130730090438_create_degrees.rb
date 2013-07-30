class CreateDegrees < ActiveRecord::Migration
  def change
    create_table :degrees do |t|
      t.integer :semester_of_deregistration
      t.decimal :grade
      t.integer :number_of_semesters

      t.timestamps
    end
  end
end
