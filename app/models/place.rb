class Place < ActiveRecord::Base
  belongs_to :post

  
  def thumbnail
     _thumbnail = PostExpand.where("post_id = ? and expand_name = 'post_thumbnail2'", post_id).last
     if _thumbnail.present?
       return _thumbnail.expand_value
     end
     return 'default.png'
  end
end
