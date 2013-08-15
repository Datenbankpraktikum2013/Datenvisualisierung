class Search < ActiveRecord::Base

	def results_for_maps

		chosen_attributes_for_search = fetch_attributes_and_classes[0]
		corresponding_classes_of_attributes = fetch_attributes_and_classes[1]
		corresponding_classes_of_attributes << "Country"

		class_of_search_category = GroupingController.fetch_all_groupable_elements[search_category]
		corresponding_classes_of_attributes << class_of_search_category
		corresponding_classes_of_attributes.delete("FederalState")

		relation_with_all_necessary_joins = join_classes(corresponding_classes_of_attributes)
		relation_with_all_necessary_joins = relation_with_all_necessary_joins.joins(LocationsController.outer_join_to_federal_states)
		relation_including_where_clauses = add_where_clauses_to_relation(chosen_attributes_for_search, relation_with_all_necessary_joins)

		hash_with_counted_results = {}
		hash_with_counted_results = relation_including_where_clauses.group(:country_iso_code, :federal_state_iso_code, :location_name).count
		hash_with_counted_results
	end


	def results_for_highcharts

		chosen_attributes_for_search = fetch_attributes_and_classes[0]
		corresponding_classes_of_attributes = fetch_attributes_and_classes[1]

		class_of_search_series = GroupingController.fetch_all_groupable_elements[search_series]
		corresponding_classes_of_attributes << class_of_search_series
		class_of_search_category = GroupingController.fetch_all_groupable_elements[search_category]
		corresponding_classes_of_attributes << class_of_search_category
		
		relation_with_all_necessary_joins = join_classes(corresponding_classes_of_attributes)
		relation_including_where_clauses = add_where_clauses_to_relation(chosen_attributes_for_search, relation_with_all_necessary_joins)

		hash_with_counted_results = {}
		
		if search_series.blank?
			complete_relation = relation_including_where_clauses.group(search_category.to_sym)
		else
			complete_relation = relation_including_where_clauses.group(search_category.to_sym, search_series.to_sym)
		end

		hash_with_counted_results = complete_relation.order("count_id DESC").count(:id)
		@title = @title + ": " + hash_with_counted_results.values.sum.to_s
		hash_with_counted_results
	end

	def get_title
		@title
	end

	private

		def controllize_name class_name
			current_controller_class = class_name.pluralize + "Controller"
			current_controller_class = current_controller_class.constantize
			current_controller_class
		end


		def fetch_attributes_and_classes
			all_attributes = SearchesController.fetch_all_searchable_elements.keys

			filtered_attributes = []
			filtered_classes = []

			all_attributes.each do |attribute|
				if attribute == "year_of_birth"
					unless minimum_age.blank? and maximum_age.blank?
						filtered_attributes << attribute
						corresponding_class_of_attribute = SearchesController.fetch_all_searchable_elements[attribute]
						filtered_classes << corresponding_class_of_attribute
					end
				else 
					unless send(attribute).blank?
						filtered_attributes << attribute
						corresponding_class_of_attribute = SearchesController.fetch_all_searchable_elements[attribute]
						filtered_classes << corresponding_class_of_attribute
					end
				end
			end		

			return filtered_attributes, filtered_classes
		end

		def add_where_clauses_to_relation (attributes, results)
			multiple_selectable_attributes = ["department_number", "kind_of_degree", "nationality", "country_iso_code"]

			attributes.each do |attribute|
				if attribute == "discipline_name"
					unless send(attribute).blank?	
	 					disciplines_to_studies_relation = Discipline.all

	 					manifestations = send(attribute).split(", ")

	 					disciplines_to_studies_relation = disciplines_to_studies_relation.where(discipline_name: manifestations)
	 					disciplines_to_studies_relation = disciplines_to_studies_relation.joins(:studies)
	 					disciplines_to_studies_relation = disciplines_to_studies_relation.group(:study_id)
	 					disciplines_to_studies_relation = disciplines_to_studies_relation.count(:discipline_id)

						array = [] 
						disciplines_to_studies_relation.each { |k, v| ( array << k ) if v >= manifestations.length }
						results = results.where("studies.id in (?)", array)
					end
				elsif multiple_selectable_attributes.include? attribute
					unless send(attribute).blank?
						manifestations = send(attribute).split(", ")
						results = results.where("#{attribute} in (?)", manifestations)
					end
				elsif attribute == "year_of_birth"
					results = results.where("#{attribute} <= ?", Date.today.year - minimum_age) unless minimum_age.blank?
					results = results.where("#{attribute} >= ?", Date.today.year - maximum_age) unless maximum_age.blank?
				else
					results = results.where("#{attribute} = ?", send(attribute)) unless self.send(attribute).blank?
				end
			end
			results
		end


	def join_classes classes_to_join
		filtered_result = Student.select("students.id")
		joined_classes = []

		if self.graduation_status == "S, A"
		 	self.graduation_status = ""
		end

		unless graduation_status.blank?
			filtered_result = filtered_result.joins(StudentsController.join_to_studies)
			joined_classes << "Study"
			if graduation_status == "A"
				#outer join degree: Alle studies zu denen MINDESTENS EIN degree vorhanden ist
				filtered_result = filtered_result.joins(StudiesController.join_to_degrees)
			elsif graduation_status == "S"
				#outer join degree: Alle studies zu denen KEIN degree vorhanden ist
				filtered_result = filtered_result.merge(Study.without_degrees)
			end
			joined_classes << "Degree"
			classes_to_join.delete("Study")
			classes_to_join.delete("Degree")
		end

		classes_to_join.delete("Student")
		classes_to_join.uniq!
		classes_to_join.compact!

		classes_to_join.each do |class_name|
			neighbor = ""
			current_class = "Student"
			current_controller_class = controllize_name(current_class)
			until class_name == neighbor
				neighbored_classes = current_controller_class.fetch_joinable_classes
				neighbored_classes.each do |neighbor_class|
					all_joinable_classes = controllize_name(neighbor_class).fetch_all_joinable_classes
					if neighbor_class == class_name
						method = "join_to_" + neighbor_class.tableize.pluralize
						filtered_result = filtered_result.joins(current_controller_class.send(method))
						joined_classes << neighbor_class
					elsif all_joinable_classes.include? class_name
						unless joined_classes.include? neighbor_class
							method = "join_to_" + neighbor_class.tableize.pluralize
							filtered_result = filtered_result.joins(current_controller_class.send(method))
							joined_classes << neighbor_class
						end
						current_class = neighbor_class
						current_controller_class = controllize_name(current_class)
					else
					end
					neighbor = neighbor_class
					break if class_name == neighbor
				end
			end
		end

		@title = "Studienköpfe"
		puts "#{joined_classes}"
		if joined_classes.include?("Study") 
			@title = "Studiengänge"
		end

		if joined_classes.include?("Discipline")
			@title = "Studienfälle"
		end
		filtered_result
	end

end
