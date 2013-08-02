class GroupingController < ApplicationController
  def self.fetch_all_groupable_elements
  	all_groupable_elements = {}

  	StudentsController.fetch_accessable_attributes.each do |attribute|
  		all_groupable_elements[attribute] = "Student"
  	end
  	all_groupable_elements
  end
end
