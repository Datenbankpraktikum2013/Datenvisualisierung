class Location < ActiveRecord::Base

	belongs_to :country
	belongs_to :federal_state

	has_many :students

	scope :with_countries, -> { joins(:country) }
	scope :with_federal_states, -> { joins(:federal_state) }

end
