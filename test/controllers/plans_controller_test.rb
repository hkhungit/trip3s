require 'test_helper'

class PlansControllerTest < ActionController::TestCase
  setup do
    @plan = plans(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:plans)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create plan" do
    assert_difference('Plan.count') do
      post :create, plan: { plan_day: @plan.plan_day, plan_end: @plan.plan_end, plan_money: @plan.plan_money, plan_spend: @plan.plan_spend, plan_start: @plan.plan_start, post_id: @plan.post_id }
    end

    assert_redirected_to plan_path(assigns(:plan))
  end

  test "should show plan" do
    get :show, id: @plan
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @plan
    assert_response :success
  end

  test "should update plan" do
    patch :update, id: @plan, plan: { plan_day: @plan.plan_day, plan_end: @plan.plan_end, plan_money: @plan.plan_money, plan_spend: @plan.plan_spend, plan_start: @plan.plan_start, post_id: @plan.post_id }
    assert_redirected_to plan_path(assigns(:plan))
  end

  test "should destroy plan" do
    assert_difference('Plan.count', -1) do
      delete :destroy, id: @plan
    end

    assert_redirected_to plans_path
  end
end
