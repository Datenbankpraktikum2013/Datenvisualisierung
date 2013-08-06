module SearchesHelper

	def render_json_for_highcharts(json)
		search_results = @search.results_for_highcharts

		category_names = []
		series_names = []
		data_of_every_series_hash = {}

		search_results.keys.each do |categories_and_series|
			category_names << categories_and_series[0]
			series_names << categories_and_series[1]
		end 
		category_names.uniq!
		series_names.uniq!

		data_of_every_series_hash = {}
		series_names.each do |series|
			data_array = []
			category_names.each do |category|
				if search_results.has_key?([category, series])
					data_array << search_results[[category, series]]
				else
					data_array << 0
				end
			end
			data_of_every_series_hash[series] = data_array
		end

		series_counter = 0

		json.set! :data do
			json.set! :categories, category_names
			json.set! :series do 
				json.array! series_names do
					json.set! :name, series_names[series_counter]
					json.set! :data, data_of_every_series_hash[series_names[series_counter]]
					series_counter += 1
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

		json.set! :countries do
			json.array! country_accumulations do |element|
				country = Country.find_by_country_iso_code(element[0])
				json.set! :country_iso_code, country.country_iso_code
				json.set! :longitude, country.longitude
				json.set! :latitude, country.latitude
				json.set! :number, element[1]
			end
		end
	end
end
