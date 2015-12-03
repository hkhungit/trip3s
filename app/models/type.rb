class Type < ActiveRecord::Base
  belongs_to :category
  has_many :post_category
end
