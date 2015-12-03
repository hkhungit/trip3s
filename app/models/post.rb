class Post < ActiveRecord::Base
	has_many :post_category
	has_many :place
end
