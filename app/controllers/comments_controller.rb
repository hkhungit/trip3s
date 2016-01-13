class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token  
  # GET /comments
  # GET /comments.json
  def index
    @comments = Comment.all
  end

  # GET /comments/1
  # GET /comments/1.json
  def show
  end

  # GET /comments/new
  def new
    @comment = Comment.new
  end

  # GET /comments/1/edit
  def edit
  end

  # POST /comments
  # POST /comments.json
  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
   
    if @comment.save
      @new_comment = @post.comments.new
      respond_to do |format|
        format.html do
          flash[:success] = 'Your comment has been posted.'
          redirect_to @post
        end
        format.js
      end
    else
      @new_comment = @comment
      respond_to do |format|
        format.html { render @post }
        format.js { render action: 'failed_save' }
      end
    end
  end 

  # DELETE /comments/1
  # DELETE /comments/1.json
  def destroy
    @comment = Comment.find(params[:id])
    @post = @comment.post
    @comment.destroy
    respond_to do |format|
      format.html do
        flash[:success] = 'Comment deleted.'
        redirect_to @post
      end
      format.js
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def comment_params
      params.require(:comment).permit(:post_id, :user_id, :comment_author, :comment_author_email, :comment_author_url, :comment_author_ip, :comment_content, :comment_status, :comment_parent, :comment_review)
    end
end
