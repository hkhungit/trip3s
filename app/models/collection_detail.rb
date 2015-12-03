class CollectionDetail < ActiveRecord::Base
  belongs_to :post
  belongs_to :place
end
