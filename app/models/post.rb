class Post < ActiveRecord::Base
	has_many :post_category
	has_many :user_post
	has_many :place
	mount_uploader :post_thumbnail, ImageUploader
end
