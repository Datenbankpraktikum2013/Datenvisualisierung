require 'test_helper'

class DegreesControllerTest < ActionController::TestCase
  setup do
    @degree = degrees(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:degrees)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create degree" do
    assert_difference('Degree.count') do
      post :create, degree: { grade: @degree.grade, number_of_semesters: @degree.number_of_semesters, semester_of_deregistration: @degree.semester_of_deregistration }
    end

    assert_redirected_to degree_path(assigns(:degree))
  end

  test "should show degree" do
    get :show, id: @degree
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @degree
    assert_response :success
  end

  test "should update degree" do
    patch :update, id: @degree, degree: { grade: @degree.grade, number_of_semesters: @degree.number_of_semesters, semester_of_deregistration: @degree.semester_of_deregistration }
    assert_redirected_to degree_path(assigns(:degree))
  end

  test "should destroy degree" do
    assert_difference('Degree.count', -1) do
      delete :destroy, id: @degree
    end

    assert_redirected_to degrees_path
  end
end
