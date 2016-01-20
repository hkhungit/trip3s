class Plan < ActiveRecord::Base
  belongs_to :post
  has_many :schedule
  #properties temponary
  attr_accessor :plan_title
  attr_accessor :plan_author
  scope :plan_type, ->{ 
	    joins(:post).where({:post =>{:post_type =>'type_plan'}}) 
	  }
  def self.loadPlan(id)
  	joins(:schedule).where(id: id).last
  end

  def self.best
    find_by_sql("select DISTINCT p.id, pl.id as plan_id, p.post_title, pl.plan_day, pl.plan_spend, pl.plan_money , (select count(id)
                            from post_expands
                             WHERE post_id  = p.id and 
                              expand_name like '%_vote' and  expand_value = '1'
                             
                            ) as liked,
                            (select expand_value from post_expands where post_id = p.id and expand_name = 'post_thumbnail2' )
                             as thumbnails
                             from posts p, post_expands e, plans pl
                      WHERE
                      pl.post_id = p.id and
                      p.post_type = 'type_plan' and
                      p.id = e.post_id
                      ORDER by  liked DESC limit 8")
  end

  def thumbnail
     _thumbnail = PostExpand.where("post_id = ? and expand_name = 'post_thumbnail2'", post_id).last
     if _thumbnail.present?
       return _thumbnail.expand_value
     end
     return '/images/default.png'
  end

  def voteLike
    liked = PostExpand.where("post_id = '?' and expand_name like '%_vote' and expand_value = '1'", post_id).count
    return liked
  end


  def voteDislike
    liked = PostExpand.where("post_id = '?' and expand_name like '%_vote' and expand_value = '0'", post_id).count

    return liked
  end 
  def user
    user = User.joins(:user_post).where({:user_posts=>{:post_id => id, :permission => 1}}).first
    return user
  end
end
