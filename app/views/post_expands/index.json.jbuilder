json.array!(@post_expands) do |post_expand|
  json.extract! post_expand, :id, :post_id, :expand_name, :expand_value_string
  json.url post_expand_url(post_expand, format: :json)
end
