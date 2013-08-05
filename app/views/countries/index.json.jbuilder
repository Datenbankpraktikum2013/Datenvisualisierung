json.array!(@countries) do |country|
  json.extract! country, :country_name
  json.url country_url(country, format: :json)
end
