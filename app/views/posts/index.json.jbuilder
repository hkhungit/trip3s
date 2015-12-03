json.array!(@posts) do |post|
  json.extract! post, :id, :post_title, :post_excerpt, :post_content, :post_status, :post_password, :post_parent, :post_type, :post_url, :post_view, :post_review, :post_point, :post_thumbnail
  json.url post_url(post, format: :json)
end
