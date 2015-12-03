require 'test_helper'

class UserPostsControllerTest < ActionController::TestCase
  setup do
    @user_post = user_posts(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_posts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_post" do
    assert_difference('UserPost.count') do
      post :create, user_post: { permission: @user_post.permission, post_id: @user_post.post_id, user_id: @user_post.user_id }
    end

    assert_redirected_to user_post_path(assigns(:user_post))
  end

  test "should show user_post" do
    get :show, id: @user_post
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_post
    assert_response :success
  end

  test "should update user_post" do
    patch :update, id: @user_post, user_post: { permission: @user_post.permission, post_id: @user_post.post_id, user_id: @user_post.user_id }
    assert_redirected_to user_post_path(assigns(:user_post))
  end

  test "should destroy user_post" do
    assert_difference('UserPost.count', -1) do
      delete :destroy, id: @user_post
    end

    assert_redirected_to user_posts_path
  end
end
