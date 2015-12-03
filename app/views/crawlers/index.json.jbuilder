json.array!(@crawlers) do |crawler|
  json.extract! crawler, :id, :title, :source, :forward
  json.url crawler_url(crawler, format: :json)
end
