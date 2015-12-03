require 'test_helper'

class UserExpandsControllerTest < ActionController::TestCase
  setup do
    @user_expand = user_expands(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_expands)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_expand" do
    assert_difference('UserExpand.count') do
      post :create, user_expand: { expand_name: @user_expand.expand_name, expand_value: @user_expand.expand_value, user_id: @user_expand.user_id }
    end

    assert_redirected_to user_expand_path(assigns(:user_expand))
  end

  test "should show user_expand" do
    get :show, id: @user_expand
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_expand
    assert_response :success
  end

  test "should update user_expand" do
    patch :update, id: @user_expand, user_expand: { expand_name: @user_expand.expand_name, expand_value: @user_expand.expand_value, user_id: @user_expand.user_id }
    assert_redirected_to user_expand_path(assigns(:user_expand))
  end

  test "should destroy user_expand" do
    assert_difference('UserExpand.count', -1) do
      delete :destroy, id: @user_expand
    end

    assert_redirected_to user_expands_path
  end
end
