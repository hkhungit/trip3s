json.array!(@places_three) do |place|
  json.extract! place,  :post_title, :post_review,:post_url,:post_thumbnail
end
