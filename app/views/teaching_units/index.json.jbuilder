json.array!(@teaching_units) do |teaching_unit|
  json.extract! teaching_unit, :teaching_unit_name
  json.url teaching_unit_url(teaching_unit, format: :json)
end
