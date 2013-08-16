module SearchesHelper

	def render_json_for_highcharts(json)
		search_results = @search.results_for_highcharts

		category_names = []
		series_names = []
		data_of_every_series_hash = {}

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
		series_names.uniq!

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

		cities_of_federal_state = {}
		search_results.each do |k,v|
			if k[0] == "DE"
				federal_state_accumulations.keys.each do |federal_state|
					if k[1] == federal_state
						if cities_of_federal_state[federal_state].nil?
							cities_of_federal_state[federal_state] = []
						end
						cities_of_federal_state[federal_state] << [k[2], v]
					end
				end
			end
		end
		json.set! :data_gmaps do
			json.array! country_accumulations do |element|
				country = Country.find_by_country_iso_code(element[0])
				json.set! :country_iso_code, country.country_iso_code
				json.set! :longitude, country.longitude
				json.set! :latitude, country.latitude
				json.set! :number, element[1]
				if country.country_iso_code == "DE"
					json.set! :federal_states do
						json.array! federal_state_accumulations do |federal_state_element|
							federal_state = FederalState.find_by_federal_state_iso_code(federal_state_element[0])
							json.set! :federal_state_iso_code, federal_state.federal_state_iso_code
							json.set! :longitude, federal_state.longitude
							json.set! :latitude, federal_state.latitude
							json.set! :number, federal_state_element[1]
							json.set! :cities do
								json.array! cities_of_federal_state[federal_state.federal_state_iso_code] do |city_element|
									city = Location.find_by_location_name(city_element[0])
									json.set! :location_name, city.location_name
									json.set! :longitude, city.longitude
									json.set! :latitude, city.latitude
									json.set! :number, city_element[1]
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
