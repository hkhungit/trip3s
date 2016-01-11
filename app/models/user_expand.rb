class UserExpand < ActiveRecord::Base
  belongs_to :user

  def self.update_expand(params)
	 	where({expand_name: params[:expand_name], user_id: params[:user_id]}).first_or_create do |expand|
	      expand.expand_name=  params[:expand_name]
	      expand.user_id=  params[:user_id]
	      expand.save!
	    end   
	end 

  def friends
  	user.user_expand.where({:expand_name =>'user_friend', :user_id => user.id})
  end
end
