class QueryPost < ActiveRecord::Base
  belongs_to :query
  belongs_to :post
end
