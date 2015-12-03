json.array!(@comments) do |comment|
  json.extract! comment, :id, :post_id, :user_id, :comment_author, :comment_author_email, :comment_author_url, :comment_author_ip, :comment_content, :comment_status, :comment_parent, :comment_review
  json.url comment_url(comment, format: :json)
end
