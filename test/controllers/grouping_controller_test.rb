require 'test_helper'

class GroupingControllerTest < ActionController::TestCase
  test "should get fetch_groupable_elements" do
    get :fetch_groupable_elements
    assert_response :success
  end

end
