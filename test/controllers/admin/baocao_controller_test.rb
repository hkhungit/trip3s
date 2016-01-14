require 'test_helper'

class Admin::BaocaoControllerTest < ActionController::TestCase
  test "should get diadiem" do
    get :diadiem
    assert_response :success
  end

  test "should get kehoach" do
    get :kehoach
    assert_response :success
  end

end
