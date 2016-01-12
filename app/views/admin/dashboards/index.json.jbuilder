json.array!(@dashboards) do |dashboard|
  json.extract! dashboard, 
  json.url dashboard_url(dashboard, format: :json)
end