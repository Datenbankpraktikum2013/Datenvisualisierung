class Location < ActiveRecord::Base

	belongs_to :federal_state

	belongs_to :country

	has_many :students
end
