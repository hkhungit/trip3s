class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user
  helper_method :is_admin
  before_filter :current_user

  def current_user 
    @current_user ||= User.find(session[:user_id]) if session[:user_id].present?
  end

  def signed_in?
    !current_user.nil?
  end

  def is_admin
    if @current_user.nil?
        redirect_to login_path
    end
    if @current_user.user_type == 'admin'
      return true
    end
    return false
  end
 
end

