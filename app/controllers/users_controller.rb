class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy, :plans]
  before_action :user_info, only: [:index, :user_password, :user_profile, :user_friend, :user_confirm, :user_places, :user_plans, :user_collections]
  layout :resolve_layout


  skip_before_action :verify_authenticity_token

  # GET /users
  # GET /users.json
  def index
    
    
  end

  def plans
    
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user }
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update( params.require(:user).permit(:user_thumbnail))
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

  #Manage user
  #profile
  def user_profile 
  end

  def user_password
    
  end
  def user_friend
    
  end

  def user_confirm
    
  end
  def user_places
    
  end
  def user_plans
    
  end

  def user_collections
    
  end
  def category_plan
    status = false
    if params[:cate].present?
      if params[:cate][:action] == 'delete'
        if params[:cate][:id].present? 
          begin
            cate = Category.where(:id=> params[:cate][:id].to_i)
            if cate.present?
              cate.destroy_all
            end
            type = Type.where(:category_id=> params[:cate][:id].to_i)
            if type.present?
              type.destroy_all 
            end
            post = PostCategory.joins(:type).where({:types => {:category_id=> params[:cate][:id].to_i}})
            if post.present?
              post.destroy_all 
            end
            status = true 
          rescue Exception => e
            status = false 
          end
        end
        render json: {
          status: status
        }
        return
      elsif params[:cate][:action] == 'add'

        if params[:cate][:id].present?
          cateCurrent = Category.joins(:type).where({:categories =>{:cate_name => params[:cate][:cate_name]}, :types => {:type_name => 'type_category_plan'}}).first_or_create do |ct|
            ct.cate_name    =  params[:cate][:cate_name]
            ct.cate_url     =  params[:cate][:cate_url]
            ct.cate_group   =  params[:cate][:cate_group]
            ct.cate_thumbnail =  params[:cate][:cate_thumbnail]
            ct.save
          end

        
          type = Type.where({:type_name => 'type_category_plan', :category_id => cateCurrent.id}).first_or_create do |tp|
            tp.type_name = 'type_category_plan'
            tp.category_id = cateCurrent.id
            tp.save
          end

          status = true
          render json: {
            cate: cateCurrent,
            status: status
          }
        end 

      elsif params[:cate][:action] == 'edit'
        cateCurrent = Category.joins(:type).where({:id => params[:cate][:id], :types => {:type_name => 'type_category_plan'}}).first_or_create do |ct|
            ct.cate_name    =  params[:cate][:cate_name]
            ct.cate_url     =  params[:cate][:cate_url]
            ct.cate_group   =  params[:cate][:cate_group]
            ct.cate_thumbnail =  params[:cate][:cate_thumbnail]
            ct.save
          end

        
          type = Type.where({:type_name => 'type_category_plan', :category_id => cateCurrent.id}).first_or_create do |tp|
            tp.type_name = 'type_category_plan'
            tp.category_id = cateCurrent.id
            tp.save
          end

          cateCurrent.update({:cate_name => params[:cate][:cate_name], :cate_url =>params[:cate][:cate_url],:cate_thumbnail =>params[:cate][:cate_thumbnail],:cate_group =>params[:cate][:cate_group]})
          
          status = true
          render json: {
            status: status
          }
      end
    end


    @plan_cate    = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_plan'}).order("categories.id desc")
  end
  def category_place
    
  end
  def category_post
    
  end

  def category_city
    
  end


  private
    
    def user_info

      if @current_user.nil?
        redirect_to login_path
      end
      @user = User.where(:id => @current_user).last
    end
    def resolve_layout
      case action_name
      when "show","plans"
        "trip3s"
      else
        "trip3s_user"
      end
    end
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:user_name, :user_pass, :user_email, :user_register, :user_activation, :user_status, :user_display, :user_thumbnail)
    end
end
