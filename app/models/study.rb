class Study < ActiveRecord::Base

	belongs_to :student
	belongs_to :degree
	has_and_belongs_to_many :disciplines

	scope :with_degrees, -> { joins(:degree) }
	scope :without_degrees, -> { where(degree_id: nil ) } 

end
