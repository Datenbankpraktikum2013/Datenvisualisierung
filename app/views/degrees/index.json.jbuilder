json.array!(@degrees) do |degree|
  json.extract! degree, :semester_of_deregistration, :grade, :number_of_semesters
  json.url degree_url(degree, format: :json)
end
