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


  def thumbnail
     _thumbnail = PostExpand.where("post_id = ? and expand_name = 'post_thumbnail2'", post_id).last
     if _thumbnail.present?
       return _thumbnail.expand_value
     end
     return 'default.png'
  end
end
