class Student < ActiveRecord::Base

	has_many :studies

	belongs_to :location

end
