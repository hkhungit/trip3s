class ImageCategory < ActiveRecord::Base
  belongs_to :type
  belongs_to :image
end
