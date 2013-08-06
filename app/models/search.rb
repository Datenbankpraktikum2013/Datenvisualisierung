class Search < ActiveRecord::Base

	def results_for_maps

		filtered_result = Student.all
		#filtered_classes.uniq.each do |class_name|
		#	filtered_result = filtered_result.joins(class_name.downcase.to_sym).load unless class_name == "Student"
		#end

		filtered_attributes = filter_attributes_and_classes[0]
		filtered_classes = filter_attributes_and_classes[1]

		filtered_result = filtered_result.joins(location: :country)

		filtered_result = filter_search_results(filtered_attributes, filtered_result)

		search_results = {}
		search_results = filtered_result.group(:country_iso_code, :location_name).count

		search_results
	end


	def results_for_highcharts
		
		filtered_attributes = filter_attributes_and_classes[0]
		filtered_classes = filter_attributes_and_classes[1]

		filtered_result = Student.all
		#filtered_classes.uniq.each do |class_name|
		#	filtered_result = filtered_result.joins(class_name.downcase.to_sym).load unless class_name == "Student"
		#end

		filtered_result = filtered_result.joins(location: :country)
		filtered_result = filter_search_results(filtered_attributes, filtered_result)

		search_results = {}
		search_results = filtered_result.group(search_category.to_sym, search_series.to_sym).count
					
		search_results
	end

	private

		def filter_attributes_and_classes
	
			all_attributes = SearchesController.fetch_all_searchable_elements.keys
			all_classes = SearchesController.fetch_all_searchable_elements.values.uniq

			filtered_attributes = []
			filtered_classes = []
			all_attributes.each do |attribute|
				if attribute == "year_of_birth"
					unless minimum_age.blank? and maximum_age.blank?
						filtered_attributes << attribute
						filtered_classes << SearchesController.fetch_all_searchable_elements[attribute]
					end
				else 
					unless send(attribute).blank?
						filtered_attributes << attribute
						filtered_classes << SearchesController.fetch_all_searchable_elements[attribute]
					end
				end
			end

			filtered_classes << GroupingController.fetch_all_groupable_elements[search_category]

			return filtered_attributes, filtered_classes
		end

		def filter_search_results (attributes, results)
			attributes.each do |attribute|
				if attribute == "year_of_birth"
					results = results.where("#{attribute} < ?", Date.today.year - minimum_age) unless minimum_age.blank?
					results = results.where("#{attribute} > ?", Date.today.year - maximum_age) unless maximum_age.blank?
				else
					results = results.where("#{attribute} = ?", send(attribute)) unless self.send(attribute).blank?
				end
			end
			results
		end

end
