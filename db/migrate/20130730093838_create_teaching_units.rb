class CreateTeachingUnits < ActiveRecord::Migration
  def change
    create_table :teaching_units do |t|
      t.string :name

      t.timestamps
    end
  end
end
