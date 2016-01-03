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
end
