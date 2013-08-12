class Search < ActiveRecord::Base


	def results_for_maps

		filtered_attributes = filter_attributes_and_classes[0]
		filtered_classes = filter_attributes_and_classes[1]
		filtered_classes << "Country" << "FederalState"
		
		filtered_result = join_classes(filtered_classes)
		filtered_result = filter_search_results(filtered_attributes, filtered_result)

		search_results = {}
		search_results = filtered_result.group(:country_iso_code, :federal_state_iso_code, :location_name).count

		search_results
	end


	def results_for_highcharts
		
		filtered_attributes = filter_attributes_and_classes[0]
		filtered_classes = filter_attributes_and_classes[1]

		filtered_classes << GroupingController.fetch_all_groupable_elements[search_series]
		
		filtered_result = join_classes(filtered_classes)

		filtered_result = filter_search_results(filtered_attributes, filtered_result)

		search_results = {}
		
		if search_series.blank?
			filtered_result = filtered_result.group(search_category.to_sym)
		else
			filtered_result = filtered_result.group(search_category.to_sym, search_series.to_sym)
		end

		#filtered_result = filtered_result.from('students')
		puts filtered_result.select("students.id").explain

		#puts filtered_result.arel

		#sql_alternative = Student.joins('INNER JOIN "locations" ON "locations"."id" = "students"."location_id"')
		#sql_alternative = sql_alternative.joins('LEFT OUTER JOIN "federal_states" ON "federal_states"."id" = "locations"."federal_state_id"')
		#sql_alternative = sql_alternative.group('federal_state_name')

		#puts sql_alternative.explain

		search_results = filtered_result.order("count_id DESC").count(:id)

		search_results
	end

	private

		def controllize_name class_name
			current_controller_class = class_name.pluralize + "Controller"
			current_controller_class = current_controller_class.constantize
			current_controller_class
		end


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
			multiple_selectable_attributes = ["department_number", "kind_of_degree", "nationality"]

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
						disciplines_to_studies_relation.each { |k, v| ( array << k ) if v >= 2 }
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

				#elsif attribute.start_with? "semester_of"
				#	results = results.where("#{attribute} = ?1 OR #{attribute} = ?2", send(attribute), send(attribute))
				else
					results = results.where("#{attribute} = ?", send(attribute)) unless self.send(attribute).blank?
				end
			end
			results
		end


	def join_classes classes_to_join
		filtered_result = Student.all
		joined_classes = []

		unless graduation_status.blank?
			filtered_result = filtered_result.merge(Student.with_studies)
			joined_classes << "Study"
			if graduation_status == "A"
				#outer join degree: Alle studies zu denen MINDESTENS EIN degree vorhanden ist
				filtered_result = filtered_result.merge(Study.with_degrees)
			else
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
						method = "with_" + neighbor_class.tableize.pluralize
						filtered_result = filtered_result.merge(current_class.constantize.send(method))
						joined_classes << neighbor_class
					elsif all_joinable_classes.include? class_name
						unless joined_classes.include? neighbor_class
							method = "with_" + neighbor_class.tableize.pluralize
							filtered_result = filtered_result.merge(current_class.constantize.send(method))
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
		filtered_result
	end

end
