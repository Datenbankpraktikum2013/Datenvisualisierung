class Study < ActiveRecord::Base

	belongs_to :student
	belongs_to :degree
	has_and_belongs_to_many :disciplines

	scope :with_disciplines, -> { joins(:disciplines) }
	scope :with_degrees, -> { joins(:degree) }

end
