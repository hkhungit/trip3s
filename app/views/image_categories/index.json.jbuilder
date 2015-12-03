json.array!(@image_categories) do |image_category|
  json.extract! image_category, :id, :type_id, :image_id
  json.url image_category_url(image_category, format: :json)
end
