json.array!(@locations) do |location|
  json.extract! location, :name
  json.url location_url(location, format: :json)
end
