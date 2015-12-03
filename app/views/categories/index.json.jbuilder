json.array!(@categories) do |category|
  json.extract! category, :id, :cate_name, :cate_url, :cate_group, :cate_thumbnail
  json.url category_url(category, format: :json)
end
