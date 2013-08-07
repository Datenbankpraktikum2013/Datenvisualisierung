class TeachingUnit < ActiveRecord::Base

	has_many :disciplines
	belongs_to :department

	scope :with_departments, -> { joins(:department) }

end
