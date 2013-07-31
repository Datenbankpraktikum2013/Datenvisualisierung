class Search < ActiveRecord::Base

	def results
		search_category = "gender"
		possible_search_manifestations_and_quantity = {}
		@students = []
		Student.find_each do |student|
			if possible_search_manifestations_and_quantity.has_key? student.gender.to_sym
				possible_search_manifestations_and_quantity[student.gender.to_sym] += 1
			else
				possible_search_manifestations_and_quantity[student.gender.to_sym] = 1
			end
		end

		possible_search_manifestations_and_quantity
	end
end
