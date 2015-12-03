json.array!(@users) do |user|
  json.extract! user, :id, :user_name, :user_pass, :user_email, :user_register, :user_activation, :user_status, :user_display, :user_thumbnail
  json.url user_url(user, format: :json)
end
