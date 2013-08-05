class GroupingController < ApplicationController
  def self.fetch_all_groupable_elements
  	all_groupable_elements = {}

  	StudentsController.fetch_accessable_attributes.each do |attribute|
  		all_groupable_elements[attribute] = "Student"
  	end

  	LocationsController.fetch_accessable_attributes.each do |attribute|
  		all_groupable_elements[attribute] = "Location"
  	end

    CountriesController.fetch_accessable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "Country"
    end

    FederalStatesController.fetch_accessable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "FederalStates"
    end
  	all_groupable_elements
  end
end
