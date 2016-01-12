json.array!(@users) do |user|
  json.extract! user, :published
  json.url user_url(user, format: :json)
end