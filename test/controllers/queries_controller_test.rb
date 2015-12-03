require 'test_helper'

class QueriesControllerTest < ActionController::TestCase
  setup do
    @query = queries(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:queries)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create query" do
    assert_difference('Query.count') do
      post :create, query: { crawler_id: @query.crawler_id, crawler_time: @query.crawler_time, post_content: @query.post_content, post_excerpt: @query.post_excerpt, post_parent: @query.post_parent, post_password: @query.post_password, post_point: @query.post_point, post_review: @query.post_review, post_thumbnail: @query.post_thumbnail, post_title: @query.post_title, post_type: @query.post_type, post_view: @query.post_view }
    end

    assert_redirected_to query_path(assigns(:query))
  end

  test "should show query" do
    get :show, id: @query
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @query
    assert_response :success
  end

  test "should update query" do
    patch :update, id: @query, query: { crawler_id: @query.crawler_id, crawler_time: @query.crawler_time, post_content: @query.post_content, post_excerpt: @query.post_excerpt, post_parent: @query.post_parent, post_password: @query.post_password, post_point: @query.post_point, post_review: @query.post_review, post_thumbnail: @query.post_thumbnail, post_title: @query.post_title, post_type: @query.post_type, post_view: @query.post_view }
    assert_redirected_to query_path(assigns(:query))
  end

  test "should destroy query" do
    assert_difference('Query.count', -1) do
      delete :destroy, id: @query
    end

    assert_redirected_to queries_path
  end
end
