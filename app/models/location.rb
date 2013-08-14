class Location < ActiveRecord::Base

	belongs_to :country
	belongs_to :federal_state

	has_many :students

end
