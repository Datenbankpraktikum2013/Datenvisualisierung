class Student < ActiveRecord::Base

	has_many :studies

	belongs_to :location
	
	scope :with_locations, -> { joins(:location) }
	scope :with_countries, -> { Location.with_countries }
	scope :with_federal_states, -> { Location.with_federal_states }

end
