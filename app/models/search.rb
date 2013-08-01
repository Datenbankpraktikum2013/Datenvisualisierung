class Search < ActiveRecord::Base

	def results
		search_category = 'nationality'
		search_series = 'gender'

		category_list = ['deutsch', 'belgisch', 'niederländisch', 'italienisch', 'ungarisch']
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
