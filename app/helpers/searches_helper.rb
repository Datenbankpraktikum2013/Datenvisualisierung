module SearchesHelper

	def render_json_for_highcharts(json, animation)
		search_results = @search.results_for_highcharts animation

		category_names = []
		series_names = []

		stacking = true
		
		search_results.keys.each do |categories_and_series|
			if categories_and_series.is_a? Array
				category_names << categories_and_series[0]
				series_names << categories_and_series[1]
			else
				category_names << categories_and_series
				stacking = false
			end
		end 
		category_names.uniq!
		category_names.sort!

		series_names.uniq!
		series_names.sort!

		series_names << "" unless stacking

		data_of_every_series_hash = {}
		series_names.each do |series|
			data_array = []
			category_names.each do |category|
				if stacking 	
					if search_results.has_key?([category, series])
						data_array << search_results[[category, series]]
					else
						data_array << 0
					end
				else
					if search_results.has_key?(category)
						data_array << search_results[category]
					else
						data_array << 0
					end
				end
			end
			data_of_every_series_hash[series] = data_array
		end

		json.set! :data do
			json.set! :title, "gezählte #{@search.get_title}"
			unless @search.get_scale_maximum_for_animation.nil?
				json.set! :scale_maximum, @search.get_scale_maximum_for_animation
			end
			json.set! :categories, category_names
			json.set! :series do 
				json.array! series_names do |series_name|
					json.set! :name, series_name
					json.set! :data, data_of_every_series_hash[series_name]
				end
			end
		end
	end

	def render_json_for_maps(json)
		search_results = @search.results_for_maps
		
		country_accumulations = {}
		search_results.each do |k,v| 
			country_iso_code = k[0]
			if country_accumulations.has_key? country_iso_code
				country_accumulations[country_iso_code] += v unless country_iso_code.nil?
			else 
				country_accumulations[country_iso_code] = v unless country_iso_code.nil?
			end
		end

		federal_state_accumulations = {}
		search_results.each do |k,v| 
			federal_state_iso_code = k[1]
			if federal_state_accumulations.has_key? federal_state_iso_code
				federal_state_accumulations[federal_state_iso_code] += v unless federal_state_iso_code.nil?
			else 
				federal_state_accumulations[federal_state_iso_code] = v unless federal_state_iso_code.nil?
			end
		end

		cities_hash = {}
		search_results.each do |k,v|
			if k[0] == "DE"
				location_name = k[2]
				cities_hash[location_name] = v
			end
		end

		countries_relation = Country.select("*")
		federal_states_relation = FederalState.select("*")
		locations_relation = Location.select("locations.*")

		json.set! :data_gmaps do
			country_array = countries_relation.load.to_a
			country_array = country_array.delete_if { |country| country_accumulations[country.country_iso_code].nil? }
			json.array! country_array do |country|
				country_iso_code = country.country_iso_code
				json.set! :country_iso_code, country_iso_code
				json.set! :longitude, country.longitude
				json.set! :latitude, country.latitude
				json.set! :number, country_accumulations[country_iso_code]
				if country_iso_code == "DE"
					json.set! :federal_states do
						federal_state_array = federal_states_relation.load.to_a
						federal_state_array = federal_state_array.delete_if { |fs| federal_state_accumulations[fs.federal_state_iso_code].nil? }
						json.array! federal_state_array do |federal_state|
							federal_state_iso_code = federal_state.federal_state_iso_code
							json.set! :federal_state_iso_code, federal_state_iso_code
							json.set! :longitude, federal_state.longitude
							json.set! :latitude, federal_state.latitude
							json.set! :number, federal_state_accumulations[federal_state_iso_code]
							json.set! :cities do
								location_array = locations_relation.joins(:federal_state).where("federal_state_iso_code = ? ", federal_state_iso_code).load.to_a
								location_array.uniq! { |location| location.location_name }
								location_array = location_array.delete_if { |loc| cities_hash[loc.location_name].nil? }
								json.array! location_array do |city|
									location_name = city.location_name
									json.set! :location_name, location_name
									json.set! :longitude, city.longitude
									json.set! :latitude, city.latitude
									json.set! :number, cities_hash[location_name]
								end
							end
						end
					end
				end
			end
		end
	end

	def render_json_for_globe(json)

		search_results = @search.results_for_maps

		data_globe = []
		inputs = []
		maxval = 0
		maxval_city = 1


		search_results.each do |key, value|
			country = Country.find_by_country_iso_code (key[0])
			if country.country_iso_code == "DE"
				city = Location.find_by_location_name key[2]
				if maxval_city < value
					maxval_city = value
				end
			elsif
				if maxval < value
					maxval = value
					#Sinnvoller multiplizieren
					maxval = 1000*(maxval_city/maxval)
				end
			end
		end


		# if maxval == 0
		# 	maxval = 1
		# end
		# if maxval_city == 0
		# 	maxval_city = 1
		# end

		search_results.each do |key, value|
			country = Country.find_by_country_iso_code (key[0])
			if country.country_iso_code == "DE"
				city = Location.find_by_location_name key[2]
				value  = value.to_f/maxval_city
				# inputs << city.latitude.to_s + "," + city.longitude.to_s + "," + value.to_s
				# inputs = []
				inputs << city.latitude
				inputs << city.longitude
				inputs << value
				#data_globe << inputs
			end
			
			value  = value.to_f/maxval
			# inputs << country.latitude.to_s + "," + country.longitude.to_s + "," + value.to_s
			# inputs = []
			inputs << country.latitude
			inputs << country.longitude
			inputs << value
			#data_globe << inputs
			
		end

		#a = Array.new(1, Hash.new)

		json.set! "data_globe", inputs
	end
end
