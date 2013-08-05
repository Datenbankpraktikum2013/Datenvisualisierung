json.array!(@federal_states) do |federal_state|
  json.extract! federal_state, :federal_state_name
  json.url federal_state_url(federal_state, format: :json)
end
