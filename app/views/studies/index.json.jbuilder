json.array!(@studies) do |study|
  json.extract! study, :semester_of_matriculation, :kind_of_degree, :number_of_semester
  json.url study_url(study, format: :json)
end
