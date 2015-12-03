require 'test_helper'

class PlacesControllerTest < ActionController::TestCase
  setup do
    @place = places(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:places)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create place" do
    assert_difference('Place.count') do
      post :create, place: { place_choice: @place.place_choice, place_close: @place.place_close, place_lat: @place.place_lat, place_late: @place.place_late, place_lng: @place.place_lng, place_open: @place.place_open, place_ticket: @place.place_ticket, post_id: @place.post_id }
    end

    assert_redirected_to place_path(assigns(:place))
  end

  test "should show place" do
    get :show, id: @place
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @place
    assert_response :success
  end

  test "should update place" do
    patch :update, id: @place, place: { place_choice: @place.place_choice, place_close: @place.place_close, place_lat: @place.place_lat, place_late: @place.place_late, place_lng: @place.place_lng, place_open: @place.place_open, place_ticket: @place.place_ticket, post_id: @place.post_id }
    assert_redirected_to place_path(assigns(:place))
  end

  test "should destroy place" do
    assert_difference('Place.count', -1) do
      delete :destroy, id: @place
    end

    assert_redirected_to places_path
  end
end
