class Search < ActiveRecord::Base

	def results
		category_objects = []
		series_objects = []
		category_list = []
		series_list = []

		filtered_result = []

		class_of_grouping_argument = GroupingController.fetch_all_groupable_elements[search_category].constantize
		category_objects = class_of_grouping_argument.select(search_category.to_sym).distinct
		category_objects.each { |s|	category_list << s.send(search_category) }

		class_of_series_argument = GroupingController.fetch_all_groupable_elements[search_series].constantize
		series_objects = class_of_series_argument.select(search_series.to_sym).distinct
		series_objects.each { |s|	series_list << s.send(search_series) }

		filtered_result = Student.all
		SearchesController.fetch_all_searchable_elements.keys.each do |attribute|
			unless self.send(attribute).empty?
				puts "IN SCHLEIFE!"
				# class_of_searched_attribute = SearchesController.fetch_all_searchable_elements[attribute].constantize
				filtered_result = filtered_result.where("#{attribute} = ?", send(attribute))
				puts filtered_result
			end
		end

		search_results = {}
		category_list.each do |category_item|
			count_series = {}
			series_list.each do |series_item|
				count_series[series_item] = filtered_result.where("#{search_category} = ? AND #{search_series} = ?", category_item, series_item).count
			end
			search_results[category_item] = count_series
		end
		search_results
	end
end
