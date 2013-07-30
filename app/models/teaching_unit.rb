class TeachingUnit < ActiveRecord::Base

	has_many :disciplines
	belongs_to :department

end
