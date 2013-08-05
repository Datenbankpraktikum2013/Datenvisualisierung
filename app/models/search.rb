class Search < ActiveRecord::Base

	def results
		category_objects = []
		series_objects = []
		category_list = []
		series_list = []
		filtered_result = []

		class_of_category_argument = GroupingController.fetch_all_groupable_elements[search_category].constantize
		category_objects = class_of_category_argument.select(search_category.to_sym).distinct
		category_objects.each { |s|	category_list << s.send(search_category) }

		class_of_series_argument = GroupingController.fetch_all_groupable_elements[search_series].constantize
		series_objects = class_of_series_argument.select(search_series.to_sym).distinct
		series_objects.each { |s| series_list << s.send(search_series) }

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

		puts "Filtered Attributes:"
		puts filtered_attributes

		puts "Filtered Classes:"
		puts filtered_classes

		filtered_classes << GroupingController.fetch_all_groupable_elements[search_category]

		filtered_result = Student.all
		#filtered_classes.uniq.each do |class_name|
		#	filtered_result = filtered_result.joins(class_name.downcase.to_sym).load unless class_name == "Student"
		#end

		filtered_result = filtered_result.joins(location: :country)

		filtered_attributes.each do |attribute|
			if attribute == "year_of_birth"
				filtered_result = filtered_result.where("#{attribute} < ?", Date.today.year - minimum_age) unless minimum_age.blank?
				filtered_result = filtered_result.where("#{attribute} > ?", Date.today.year - maximum_age) unless maximum_age.blank?
			else
				filtered_result = filtered_result.where("#{attribute} = ?", send(attribute)) unless self.send(attribute).blank?
			end
		end

		search_results = {}
		search_results = filtered_result.group(search_category.to_sym, search_series.to_sym).count
		
		search_results
	end
end
