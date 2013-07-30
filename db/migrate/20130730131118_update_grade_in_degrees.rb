class UpdateGradeInDegrees < ActiveRecord::Migration
  def up
  	change_column :degrees, :grade, :decimal, :precision => 2, :scale => 1
  end
  def down
  	change_column :degrees, :grade, :decimal
  end
end
