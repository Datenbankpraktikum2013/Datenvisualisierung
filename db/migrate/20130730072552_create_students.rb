class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :gender
      t.string :matriculation_number
      t.integer :year_of_birthDDD
      t.string :nationality

      t.timestamps
    end
  end
end
