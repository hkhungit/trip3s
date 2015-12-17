json.array!(@places_two_limit_one) do |place|
  json.extract! place, :id, :post_title, :post_id, :place_lat, :place_lng, :place_ticket, :place_open, :place_close, :place_late, :place_choice
  json.url place_url(place, format: :json)
end
