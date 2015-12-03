require 'test_helper'

class ConfigOptionsControllerTest < ActionController::TestCase
  setup do
    @config_option = config_options(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:config_options)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create config_option" do
    assert_difference('ConfigOption.count') do
      post :create, config_option: { config_name: @config_option.config_name, config_value: @config_option.config_value }
    end

    assert_redirected_to config_option_path(assigns(:config_option))
  end

  test "should show config_option" do
    get :show, id: @config_option
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @config_option
    assert_response :success
  end

  test "should update config_option" do
    patch :update, id: @config_option, config_option: { config_name: @config_option.config_name, config_value: @config_option.config_value }
    assert_redirected_to config_option_path(assigns(:config_option))
  end

  test "should destroy config_option" do
    assert_difference('ConfigOption.count', -1) do
      delete :destroy, id: @config_option
    end

    assert_redirected_to config_options_path
  end
end
