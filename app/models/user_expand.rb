class UserExpand < ActiveRecord::Base
  belongs_to :user



  def friends
  	user.user_expand.where({:expand_name =>'user_friend', :user_id => user.id})
  end
end
