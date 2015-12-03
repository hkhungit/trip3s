json.array!(@images) do |image|
  json.extract! image, :id, :image_title, :image_url, :image_alt
  json.url image_url(image, format: :json)
end
