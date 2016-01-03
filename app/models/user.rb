class User < ActiveRecord::Base
	has_many :user_post
	has_many :user_expand
	attr_accessor :validate_location



	def self.from_omniauth(auth)
	 	where(user_name: auth[:id]).first_or_create do |user|
	      user.user_activation 	= 'facebook'
	      user.user_name 		= auth[:id]
	      user.user_display 	= auth[:name]
	      user.user_email	 	= auth[:email]
	      user.user_pass 		= auth[:token]
	      user.user_thumbnail 	= auth[:image]
	      user.save!
	    end   
	end
	def friends
		user_expand.where({:expand_name =>'user_friend', :user_id => id})
	end
	def id_friends(id = nil,id1 = nil)
		if id.nil?
			return false
		end

		expand = UserExpand.where(" user_expands.expand_name = 'user_friend' and ((user_expands.user_id='?' and  expand_value ='?') or (user_expands.user_id='?' and  expand_value ='?')) ",id,id1,id1,id)
		if expand.count > 0
			return true
		end
		return false
	end

	def location
		expand = UserExpand.where({:user_expands =>{:expand_name => 'user_location', :user_id => id}}).first;

		if expand.nil?
			return ''
		end
		
		return expand.expand_value
	end
	def feeling
		expand = UserExpand.where({:user_expands =>{:expand_name => 'user_feeling', :user_id => id}}).first;

		if expand.nil?
			return ''
		end
		
		return expand.expand_value
	end

end

