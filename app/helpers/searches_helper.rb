module SearchesHelper

	def render_json_for_highcharts(json)
		search_results = @search.results

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
		json.set! :country do
			json.set! :iso_country_code, "DE"
			json.set! :longitude, 0
			json.set! :latitude, 0
			json.set! :number, 5
			json.set! :states do
				json.set! :iso_state_code, "DE-NI"
				json.set! :longitude, 0
				json.set! :latitude, 50
				json.set! :number, 4
				json.set! :cities do
					json.set! :longitude, 52
					json.set! :latitude, 8
					json.set! :number, 2
				end
			end
		end
	end
end
