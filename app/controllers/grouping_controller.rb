class GroupingController < ApplicationController
  def self.fetch_all_groupable_elements
  	all_groupable_elements = {}

  	StudentsController.fetch_groupable_attributes.each do |attribute|
  		all_groupable_elements[attribute] = "Student"
  	end

  	LocationsController.fetch_groupable_attributes.each do |attribute|
  		all_groupable_elements[attribute] = "Location"
  	end

    CountriesController.fetch_groupable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "Country"
    end

    FederalStatesController.fetch_groupable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "FederalState"
    end

    StudiesController.fetch_groupable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "Study"
    end

    DisciplinesController.fetch_groupable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "Discipline"
    end

    TeachingUnitsController.fetch_groupable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "TeachingUnit"
    end

    DepartmentsController.fetch_groupable_attributes.each do |attribute|
      all_groupable_elements[attribute] = "Department"
    end

  	all_groupable_elements
  end
end
