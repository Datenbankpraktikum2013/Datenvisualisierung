json.array!(@students) do |student|
  json.extract! student, :gender, :matriculation_number, :year_of_birthDDD, :nationality
  json.url student_url(student, format: :json)
end
