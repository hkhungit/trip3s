json.array!(@queries) do |query|
  json.extract! query, :id, :crawler_id, :crawler_time, :post_title, :post_excerpt, :post_content, :post_password, :post_parent, :post_type, :post_view, :post_review, :post_point, :post_thumbnail
  json.url query_url(query, format: :json)
end
