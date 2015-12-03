json.array!(@collection_details) do |collection_detail|
  json.extract! collection_detail, :id, :post_id, :place_id
  json.url collection_detail_url(collection_detail, format: :json)
end
