json.array!(@plans) do |plan|
  json.extract! plan, :id, :post_id, :plan_day, :plan_start, :plan_end, :plan_money, :plan_spend
  json.url plan_url(plan, format: :json)
end
