json.array!(@schedules) do |schedule|
  json.extract! schedule, :id, :plan_id, :schedule_day, :schedule_action, :schedule_spend, :schedule_distance, :schedule_start, :schedule_end
  json.url schedule_url(schedule, format: :json)
end
