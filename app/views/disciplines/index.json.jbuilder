json.array!(@disciplines) do |discipline|
  json.extract! discipline, :discipline_name
  json.url discipline_url(discipline, format: :json)
end
