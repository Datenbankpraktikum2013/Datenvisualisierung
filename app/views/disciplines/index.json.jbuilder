json.array!(@disciplines) do |discipline|
  json.extract! discipline, :name
  json.url discipline_url(discipline, format: :json)
end
