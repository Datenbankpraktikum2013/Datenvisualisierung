class CreateFederalStates < ActiveRecord::Migration
  def change
    create_table :federal_states do |t|
      t.string :name

      t.timestamps
    end
  end
end
