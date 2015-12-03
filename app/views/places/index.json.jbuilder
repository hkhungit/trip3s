json.array!(@places) do |place|
  json.extract! place, :id, :post_id, :place_lat, :place_lng, :place_ticket, :place_open, :place_close, :place_late, :place_choice
  json.url place_url(place, format: :json)
end
