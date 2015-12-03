class PostCategory < ActiveRecord::Base
  belongs_to :type
  belongs_to :post
end
