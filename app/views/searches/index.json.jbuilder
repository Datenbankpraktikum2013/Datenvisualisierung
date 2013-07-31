json.array!(@searches) do |search|
  json.extract! search, :gender, :nationality
  json.url search_url(search, format: :json)
end
