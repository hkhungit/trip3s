json.array!(@query_posts) do |query_post|
  json.extract! query_post, :id, :query_id, :post_id, :focus_time, :focus_late
  json.url query_post_url(query_post, format: :json)
end
