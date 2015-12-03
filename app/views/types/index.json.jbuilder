json.array!(@types) do |type|
  json.extract! type, :id, :type_name, :type_description, :type_parent, :type_count, :category_id
  json.url type_url(type, format: :json)
end
