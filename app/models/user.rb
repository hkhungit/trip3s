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
	def user_phone
		expand = UserExpand.where(" user_expands.expand_name = 'user_phone' and user_expands.user_id='?'  ",id).last
		if expand.blank?
			return ''
		end
		
		return expand.expand_value
	end
	def user_address
		expand = UserExpand.where("user_expands.expand_name = 'user_address' and user_expands.user_id='?'  ",id).last
		if expand.blank?
			return ''
		end
		
		return expand.expand_value
	end
	def name_display
		if user_display.blank?
			return user_name
		elsif  user_display == ''
			return user_name
		else
			return user_display
		end
	end
	def friends
		user_expand.where({:expand_name =>'user_friend', :user_id => id})
	end
	def id_friends(id1 = nil)
		if id1.nil?
			return false
		end
		if id == id1
			return true
		end
		expand = UserExpand.where("( user_expands.expand_name = 'user_friend' or  user_expands.expand_name = 'user_confirm') and ((user_expands.user_id='?' and  expand_value ='?') or (user_expands.user_id='?' and  expand_value ='?')) ",id,id1,id1,id)
		if expand.count > 0
			return true
		end
		return false
	end

	def location
		expand = UserExpand.where({:user_expands =>{:expand_name => 'user_latlng', :user_id => id}}).first;

		if expand.nil?
			return ''
		end
		
		return expand.expand_value
	end

	def countFriends
		
		begin
			expands = UserExpand.where(" user_expands.expand_name = 'user_friend' and (user_expands.user_id='?' or  user_expands.expand_value ='?') ",id,id)
			return expands.count
		rescue Exception => e
			return 0
		end
	end

	def countPlans
		begin
			plans  = Post.joins(:user_post).where({:user_posts =>{ :user_id => id}, :posts => {:post_type => 'type_plan'}})
			return plans.count
		rescue Exception => e
			return 0
		end
	end

	def countPlaces
		begin
			places  = Post.joins(:user_post).where({:user_posts =>{ :user_id => id}, :posts => {:post_type => 'type_place'}})
			return places.count
		rescue Exception => e
			return 0
		end
	end

	def places(page = 0)
		limit = 5
		page = page * limit
		begin
			places  = Post.joins(:user_post,:places).where({:user_posts =>{ :user_id => id}, :posts => {:post_type => 'type_place'}}).limit(limit).offset(page)
			return places
		rescue Exception => e
			return 0
		end
	end
	def plans(page = 0)
		limit = 5
		page = page * limit
		begin
			places  = Post.joins(:user_post,:plans).where({:user_posts =>{ :user_id => id}, :posts => {:post_type => 'type_plan'}}).limit(limit).offset(page)
			return places
		rescue Exception => e
			return 0
		end
	end
	def collections(page = 0)
		limit = 5
		page = page * limit
		begin
			places  = Post.joins(:user_post).where({:user_posts =>{ :user_id => id}, :posts => {:post_type => 'type_collection'}}).limit(limit).offset(page)
			return places
		rescue Exception => e
			return 0
		end
	end

	def countCollections
		begin
			collections  = Post.joins(:user_post).where({:user_posts =>{ :user_id => id}, :posts => {:post_type => 'type_collection'}})
			return collections.count
		rescue Exception => e
			return 0
		end
	end

	def Friends
		begin
			filter1 = UserExpand.select("user_expands.expand_value").where("user_expands.expand_name = 'user_friend' and user_expands.user_id='?'",id)
			filter2 = UserExpand.select("user_expands.user_id").where("user_expands.expand_name = 'user_friend' and user_expands.expand_value='?'",id)
			filter1 << filter2

			puts filter1
			expands = User.where("users.id in (?)",filter1)
			return expands
		rescue Exception => e
			return nil
		end
	end

	def Confirms
		begin
			filter1 = UserExpand.select("user_expands.expand_value").where("user_expands.expand_name = 'user_confirm' and user_expands.user_id='?'",id) 
			expands = User.where("users.id in (?)",filter1)
			return expands
		rescue Exception => e
			return nil
		end
	end


	def feeling
		expand = UserExpand.where({:user_expands =>{:expand_name => 'user_feeling', :user_id => id}}).first;

		if expand.nil?
			return ''
		end
		
		return expand.expand_value
	end

end

