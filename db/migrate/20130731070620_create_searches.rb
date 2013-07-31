class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
      t.string :gender
      t.string :nationality

      t.timestamps
    end
  end
end
