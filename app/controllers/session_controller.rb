class SessionController < ApplicationController
	def create


	    user = User.from_omniauth(params[:user])
	    session[:user_id] = user.id
	    
	    render json: user



	end

	def destroy
	    session[:user_id] = nil
	    redirect_to root_path
	end

	def login

	
		if current_user
			redirect_to root_path
		end
	end

	def signin
		@user = User.new
	end
end
