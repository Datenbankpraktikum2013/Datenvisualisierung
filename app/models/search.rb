class Search < ActiveRecord::Base

	def results
		search_category = grouping
		search_series = 'gender'
		grouping_objects = []
		category_list = []

		class_of_grouping_argument = GroupingController.fetch_all_groupable_elements[grouping].constantize
		grouping_objects = class_of_grouping_argument.select(grouping.to_sym).distinct
		grouping_objects.each { |s|	category_list << s.send(grouping) }

		series_list = ['männlich', 'weiblich']
		search_results = {}
		category_list.each do |category_item|
			count_series = {}
			series_list.each do |series_item|
				count_series[series_item] = Student.where("#{search_category} = ? AND #{search_series} = ?", category_item, series_item).count
			end
			search_results[category_item] = count_series
		end
		search_results
	end
end
