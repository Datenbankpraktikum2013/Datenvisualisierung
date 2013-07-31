@series = [1]

json.set! :data do
	json.set! :categories, @search.results.keys
	json.set! :series do 
		json.array! @series do
			json.set! :name, ""
			json.set! :data, @search.results.values
		end
	end
end