require 'test_helper'

class PostsControllerTest < ActionController::TestCase
  setup do
    @post = posts(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:posts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create post" do
    assert_difference('Post.count') do
      post :create, post: { post_content: @post.post_content, post_excerpt: @post.post_excerpt, post_parent: @post.post_parent, post_password: @post.post_password, post_point: @post.post_point, post_review: @post.post_review, post_status: @post.post_status, post_thumbnail: @post.post_thumbnail, post_title: @post.post_title, post_type: @post.post_type, post_url: @post.post_url, post_view: @post.post_view }
    end

    assert_redirected_to post_path(assigns(:post))
  end

  test "should show post" do
    get :show, id: @post
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @post
    assert_response :success
  end

  test "should update post" do
    patch :update, id: @post, post: { post_content: @post.post_content, post_excerpt: @post.post_excerpt, post_parent: @post.post_parent, post_password: @post.post_password, post_point: @post.post_point, post_review: @post.post_review, post_status: @post.post_status, post_thumbnail: @post.post_thumbnail, post_title: @post.post_title, post_type: @post.post_type, post_url: @post.post_url, post_view: @post.post_view }
    assert_redirected_to post_path(assigns(:post))
  end

  test "should destroy post" do
    assert_difference('Post.count', -1) do
      delete :destroy, id: @post
    end

    assert_redirected_to posts_path
  end
end
