json.array!(@query_expands) do |query_expand|
  json.extract! query_expand, :id, :query_id, :expand_name, :expand_value
  json.url query_expand_url(query_expand, format: :json)
end
