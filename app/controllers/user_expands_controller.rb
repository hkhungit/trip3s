class UserExpandsController < ApplicationController
  before_action :set_user_expand, only: [:show, :edit, :update, :destroy]

  # GET /user_expands
  # GET /user_expands.json
  def index
    @user_expands = UserExpand.all
  end

  # GET /user_expands/1
  # GET /user_expands/1.json
  def show
  end

  # GET /user_expands/new
  def new
    @user_expand = UserExpand.new
  end

  # GET /user_expands/1/edit
  def edit
  end

  # POST /user_expands
  # POST /user_expands.json
  def create
    @user_expand = UserExpand.new(user_expand_params)

    respond_to do |format|
      if @user_expand.save
        format.html { redirect_to @user_expand, notice: 'User expand was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user_expand }
      else
        format.html { render action: 'new' }
        format.json { render json: @user_expand.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_expands/1
  # PATCH/PUT /user_expands/1.json
  def update
    respond_to do |format|
      if @user_expand.update(user_expand_params)
        format.html { redirect_to @user_expand, notice: 'User expand was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user_expand.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_expands/1
  # DELETE /user_expands/1.json
  def destroy
    @user_expand.destroy
    respond_to do |format|
      format.html { redirect_to user_expands_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_expand
      @user_expand = UserExpand.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_expand_params
      params.require(:user_expand).permit(:user_id, :expand_name, :expand_value)
    end
end
