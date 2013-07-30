require 'test_helper'

class StudiesControllerTest < ActionController::TestCase
  setup do
    @study = studies(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:studies)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create study" do
    assert_difference('Study.count') do
      post :create, study: { kind_of_degree: @study.kind_of_degree, number_of_semester: @study.number_of_semester, semester_of_matriculation: @study.semester_of_matriculation }
    end

    assert_redirected_to study_path(assigns(:study))
  end

  test "should show study" do
    get :show, id: @study
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @study
    assert_response :success
  end

  test "should update study" do
    patch :update, id: @study, study: { kind_of_degree: @study.kind_of_degree, number_of_semester: @study.number_of_semester, semester_of_matriculation: @study.semester_of_matriculation }
    assert_redirected_to study_path(assigns(:study))
  end

  test "should destroy study" do
    assert_difference('Study.count', -1) do
      delete :destroy, id: @study
    end

    assert_redirected_to studies_path
  end
end
