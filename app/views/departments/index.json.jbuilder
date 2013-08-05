json.array!(@departments) do |department|
  json.extract! department, :department_name, :number
  json.url department_url(department, format: :json)
end
