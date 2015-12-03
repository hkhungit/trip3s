json.array!(@user_expands) do |user_expand|
  json.extract! user_expand, :id, :user_id, :expand_name, :expand_value
  json.url user_expand_url(user_expand, format: :json)
end
