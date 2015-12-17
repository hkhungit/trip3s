class User < ActiveRecord::Base
	def self.from_omniauth(auth)
	 	where(user_activation: auth.provider, user_name: auth.uid).first_or_create do |user|
	      user.user_activation 	= auth.provider
	      user.user_name 		= auth.uid
	      user.user_display 	= auth.info.name
	      user.user_pass 		= auth.credentials.token
	      user.user_thumbnail 	= auth.info.image
	      user.updated_at = Time.at(auth.credentials.expires_at)
	      user.save!
	    end   
	end
end

