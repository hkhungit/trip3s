class Post < ActiveRecord::Base
	has_many :post_category
	has_many :user_post
	has_many :place
	has_many :plans
	mount_uploader :post_thumbnail, ImageUploader


	def thumbnail 
		if post_thumbnail.url.nil?
			return '/images/default.png'
		end
	    if post_thumbnail.url.include? "http"
	       return post_thumbnail_identifier 
	    end
	    return post_thumbnail.url
	end

	def user
		user = User.joins(:user_post).where({:user_posts=>{:post_id => id, :permission => 1}}).first
		return user
	end

  def voteLike
    liked = PostExpand.where("post_id = '?' and expand_name like '%_vote' and expand_value = '1'", id).count

    return liked
  end
  def voteDislike
    liked = PostExpand.where("post_id = '?' and expand_name like '%_vote' and expand_value = '0'", id).count

    return liked
  end 
end
