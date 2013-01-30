require 'test_helper'

class ParticlesControllerTest < ActionController::TestCase
  setup do
    @particle = particles(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:particles)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create particle" do
    assert_difference('Particle.count') do
      post :create, particle: @particle.attributes
    end

    assert_redirected_to particle_path(assigns(:particle))
  end

  test "should show particle" do
    get :show, id: @particle
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @particle
    assert_response :success
  end

  test "should update particle" do
    put :update, id: @particle, particle: @particle.attributes
    assert_redirected_to particle_path(assigns(:particle))
  end

  test "should destroy particle" do
    assert_difference('Particle.count', -1) do
      delete :destroy, id: @particle
    end

    assert_redirected_to particles_path
  end
end
