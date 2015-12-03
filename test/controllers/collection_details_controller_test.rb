require 'test_helper'

class CollectionDetailsControllerTest < ActionController::TestCase
  setup do
    @collection_detail = collection_details(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:collection_details)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create collection_detail" do
    assert_difference('CollectionDetail.count') do
      post :create, collection_detail: { place_id: @collection_detail.place_id, post_id: @collection_detail.post_id }
    end

    assert_redirected_to collection_detail_path(assigns(:collection_detail))
  end

  test "should show collection_detail" do
    get :show, id: @collection_detail
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @collection_detail
    assert_response :success
  end

  test "should update collection_detail" do
    patch :update, id: @collection_detail, collection_detail: { place_id: @collection_detail.place_id, post_id: @collection_detail.post_id }
    assert_redirected_to collection_detail_path(assigns(:collection_detail))
  end

  test "should destroy collection_detail" do
    assert_difference('CollectionDetail.count', -1) do
      delete :destroy, id: @collection_detail
    end

    assert_redirected_to collection_details_path
  end
end
