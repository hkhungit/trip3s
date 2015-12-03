require 'test_helper'

class CrawlersControllerTest < ActionController::TestCase
  setup do
    @crawler = crawlers(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:crawlers)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create crawler" do
    assert_difference('Crawler.count') do
      post :create, crawler: { forward: @crawler.forward, source: @crawler.source, title: @crawler.title }
    end

    assert_redirected_to crawler_path(assigns(:crawler))
  end

  test "should show crawler" do
    get :show, id: @crawler
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @crawler
    assert_response :success
  end

  test "should update crawler" do
    patch :update, id: @crawler, crawler: { forward: @crawler.forward, source: @crawler.source, title: @crawler.title }
    assert_redirected_to crawler_path(assigns(:crawler))
  end

  test "should destroy crawler" do
    assert_difference('Crawler.count', -1) do
      delete :destroy, id: @crawler
    end

    assert_redirected_to crawlers_path
  end
end
