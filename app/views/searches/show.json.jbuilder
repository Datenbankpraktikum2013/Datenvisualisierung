categories_names = @search.results.keys
series_names = []
@search.results.values[0].each do |k, v|
	series_names << k
end

counter = 0
series_counter = 0

data_of_every_series_hash = {}

series_names.each do |s|
	data_of_every_series_hash[s] = []
	categories_names.each do |c| 
		current_series = @search.results.values[series_counter]
		data_of_every_series_hash[s] << current_series[s]
		series_counter += 1
	end
	series_counter = 0
end

json.set! :data do
	json.set! :categories, categories_names
	json.set! :series do 
		json.array! series_names do
			json.set! :name, series_names[counter]
			json.set! :data, data_of_every_series_hash[series_names[counter]]
			counter += 1
		end
	end
end