require 'test_helper'

class ScheduleDetailsControllerTest < ActionController::TestCase
  setup do
    @schedule_detail = schedule_details(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:schedule_details)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create schedule_detail" do
    assert_difference('ScheduleDetail.count') do
      post :create, schedule_detail: { next_distance: @schedule_detail.next_distance, next_time: @schedule_detail.next_time, place_id: @schedule_detail.place_id, place_in: @schedule_detail.place_in, place_name: @schedule_detail.place_name, place_out: @schedule_detail.place_out, place_spend: @schedule_detail.place_spend, schedule_id: @schedule_detail.schedule_id }
    end

    assert_redirected_to schedule_detail_path(assigns(:schedule_detail))
  end

  test "should show schedule_detail" do
    get :show, id: @schedule_detail
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @schedule_detail
    assert_response :success
  end

  test "should update schedule_detail" do
    patch :update, id: @schedule_detail, schedule_detail: { next_distance: @schedule_detail.next_distance, next_time: @schedule_detail.next_time, place_id: @schedule_detail.place_id, place_in: @schedule_detail.place_in, place_name: @schedule_detail.place_name, place_out: @schedule_detail.place_out, place_spend: @schedule_detail.place_spend, schedule_id: @schedule_detail.schedule_id }
    assert_redirected_to schedule_detail_path(assigns(:schedule_detail))
  end

  test "should destroy schedule_detail" do
    assert_difference('ScheduleDetail.count', -1) do
      delete :destroy, id: @schedule_detail
    end

    assert_redirected_to schedule_details_path
  end
end
