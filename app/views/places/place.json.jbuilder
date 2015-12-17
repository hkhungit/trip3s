json.array!(@places_two_limit_one) do |place|
  json.extract! place,  :post_title, :post_review, :place_choice,:post_url,:post_thumbnail
end
