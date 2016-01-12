json.array!(@plans) do |plan|
  json.extract! plan, 
  json.url plan_url(plan, format: :json)
end