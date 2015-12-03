json.array!(@schedule_details) do |schedule_detail|
  json.extract! schedule_detail, :id, :place_id, :schedule_id, :place_name, :place_spend, :place_in, :place_out, :next_time, :next_distance
  json.url schedule_detail_url(schedule_detail, format: :json)
end
