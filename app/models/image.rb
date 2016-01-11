class Image < ActiveRecord::Base
	has_many :post_image
	 mount_uploader :image_url, ImageUploader
end
