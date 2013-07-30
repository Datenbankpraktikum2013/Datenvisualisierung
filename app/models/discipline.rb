class Discipline < ActiveRecord::Base

	has_and_belongs_to_many :studies
	belongs_to :teaching_unit

end
