require 'test_helper'

class QueryPostsControllerTest < ActionController::TestCase
  setup do
    @query_post = query_posts(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:query_posts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create query_post" do
    assert_difference('QueryPost.count') do
      post :create, query_post: { focus_late: @query_post.focus_late, focus_time: @query_post.focus_time, post_id: @query_post.post_id, query_id: @query_post.query_id }
    end

    assert_redirected_to query_post_path(assigns(:query_post))
  end

  test "should show query_post" do
    get :show, id: @query_post
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @query_post
    assert_response :success
  end

  test "should update query_post" do
    patch :update, id: @query_post, query_post: { focus_late: @query_post.focus_late, focus_time: @query_post.focus_time, post_id: @query_post.post_id, query_id: @query_post.query_id }
    assert_redirected_to query_post_path(assigns(:query_post))
  end

  test "should destroy query_post" do
    assert_difference('QueryPost.count', -1) do
      delete :destroy, id: @query_post
    end

    assert_redirected_to query_posts_path
  end
end
