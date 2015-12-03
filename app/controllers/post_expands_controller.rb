class PostExpandsController < ApplicationController
  before_action :set_post_expand, only: [:show, :edit, :update, :destroy]

  # GET /post_expands
  # GET /post_expands.json
  def index
    @post_expands = PostExpand.all
  end

  # GET /post_expands/1
  # GET /post_expands/1.json
  def show
  end

  # GET /post_expands/new
  def new
    @post_expand = PostExpand.new
  end

  # GET /post_expands/1/edit
  def edit
  end

  # POST /post_expands
  # POST /post_expands.json
  def create
    @post_expand = PostExpand.new(post_expand_params)

    respond_to do |format|
      if @post_expand.save
        format.html { redirect_to @post_expand, notice: 'Post expand was successfully created.' }
        format.json { render action: 'show', status: :created, location: @post_expand }
      else
        format.html { render action: 'new' }
        format.json { render json: @post_expand.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /post_expands/1
  # PATCH/PUT /post_expands/1.json
  def update
    respond_to do |format|
      if @post_expand.update(post_expand_params)
        format.html { redirect_to @post_expand, notice: 'Post expand was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @post_expand.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /post_expands/1
  # DELETE /post_expands/1.json
  def destroy
    @post_expand.destroy
    respond_to do |format|
      format.html { redirect_to post_expands_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post_expand
      @post_expand = PostExpand.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_expand_params
      params.require(:post_expand).permit(:post_id, :expand_name, :expand_value_string)
    end
end
