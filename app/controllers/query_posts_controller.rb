class QueryPostsController < ApplicationController
  before_action :set_query_post, only: [:show, :edit, :update, :destroy]

  # GET /query_posts
  # GET /query_posts.json
  def index
    @query_posts = QueryPost.all
  end

  # GET /query_posts/1
  # GET /query_posts/1.json
  def show
  end

  # GET /query_posts/new
  def new
    @query_post = QueryPost.new
  end

  # GET /query_posts/1/edit
  def edit
  end

  # POST /query_posts
  # POST /query_posts.json
  def create
    @query_post = QueryPost.new(query_post_params)

    respond_to do |format|
      if @query_post.save
        format.html { redirect_to @query_post, notice: 'Query post was successfully created.' }
        format.json { render action: 'show', status: :created, location: @query_post }
      else
        format.html { render action: 'new' }
        format.json { render json: @query_post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /query_posts/1
  # PATCH/PUT /query_posts/1.json
  def update
    respond_to do |format|
      if @query_post.update(query_post_params)
        format.html { redirect_to @query_post, notice: 'Query post was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @query_post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /query_posts/1
  # DELETE /query_posts/1.json
  def destroy
    @query_post.destroy
    respond_to do |format|
      format.html { redirect_to query_posts_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_query_post
      @query_post = QueryPost.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def query_post_params
      params.require(:query_post).permit(:query_id, :post_id, :focus_time, :focus_late)
    end
end
