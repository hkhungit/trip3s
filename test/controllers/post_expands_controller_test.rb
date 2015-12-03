require 'test_helper'

class PostExpandsControllerTest < ActionController::TestCase
  setup do
    @post_expand = post_expands(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:post_expands)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create post_expand" do
    assert_difference('PostExpand.count') do
      post :create, post_expand: { expand_name: @post_expand.expand_name, expand_value_string: @post_expand.expand_value_string, post_id: @post_expand.post_id }
    end

    assert_redirected_to post_expand_path(assigns(:post_expand))
  end

  test "should show post_expand" do
    get :show, id: @post_expand
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @post_expand
    assert_response :success
  end

  test "should update post_expand" do
    patch :update, id: @post_expand, post_expand: { expand_name: @post_expand.expand_name, expand_value_string: @post_expand.expand_value_string, post_id: @post_expand.post_id }
    assert_redirected_to post_expand_path(assigns(:post_expand))
  end

  test "should destroy post_expand" do
    assert_difference('PostExpand.count', -1) do
      delete :destroy, id: @post_expand
    end

    assert_redirected_to post_expands_path
  end
end
