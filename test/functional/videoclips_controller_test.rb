require 'test_helper'

class VideoclipsControllerTest < ActionController::TestCase
  setup do
    @videoclip = videoclips(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:videoclips)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create videoclip" do
    assert_difference('Videoclip.count') do
      post :create, :videoclip => @videoclip.attributes
    end

    assert_redirected_to videoclip_path(assigns(:videoclip))
  end

  test "should show videoclip" do
    get :show, :id => @videoclip
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @videoclip
    assert_response :success
  end

  test "should update videoclip" do
    put :update, :id => @videoclip, :videoclip => @videoclip.attributes
    assert_redirected_to videoclip_path(assigns(:videoclip))
  end

  test "should destroy videoclip" do
    assert_difference('Videoclip.count', -1) do
      delete :destroy, :id => @videoclip
    end

    assert_redirected_to videoclips_path
  end
end
