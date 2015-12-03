require 'test_helper'

class QueryExpandsControllerTest < ActionController::TestCase
  setup do
    @query_expand = query_expands(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:query_expands)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create query_expand" do
    assert_difference('QueryExpand.count') do
      post :create, query_expand: { expand_name: @query_expand.expand_name, expand_value: @query_expand.expand_value, query_id: @query_expand.query_id }
    end

    assert_redirected_to query_expand_path(assigns(:query_expand))
  end

  test "should show query_expand" do
    get :show, id: @query_expand
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @query_expand
    assert_response :success
  end

  test "should update query_expand" do
    patch :update, id: @query_expand, query_expand: { expand_name: @query_expand.expand_name, expand_value: @query_expand.expand_value, query_id: @query_expand.query_id }
    assert_redirected_to query_expand_path(assigns(:query_expand))
  end

  test "should destroy query_expand" do
    assert_difference('QueryExpand.count', -1) do
      delete :destroy, id: @query_expand
    end

    assert_redirected_to query_expands_path
  end
end
