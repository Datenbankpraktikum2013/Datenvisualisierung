class SearchesController < ApplicationController
  before_action :set_search, only: [:show, :edit, :update, :destroy]
  protect_from_forgery :except => :edit 

  # GET /searches
  # GET /searches.json
  def index
    @searches = Search.all
  end

  # GET /searches/1
  # GET /searches/1.json
  def show

  end

  # GET /searches/new
  def new
    @search = Search.new
  end

  # GET /searches/1/edit
  def edit
  end

  # POST /searches
  # POST /searches.json
  def create
    @search = Search.new(search_params)

    respond_to do |format|
      if @search.save
        format.html { redirect_to @search, notice: 'Search was successfully created.' }
        format.json { render action: 'show', status: :created, location: @search }
      else
        format.html { render action: 'new' }
        format.json { render json: @search.errors, status: :unprocessable_entity }
      end
    end
   
  end

  # PATCH/PUT /searches/1
  # PATCH/PUT /searches/1.json
  def update
    respond_to do |format|
      if @search.update(search_params)
        format.html { redirect_to @search, notice: 'Search was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @search.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /searches/1
  # DELETE /searches/1.json
  def destroy
    @search.destroy
    respond_to do |format|
      format.html { redirect_to searches_url }
      format.json { head :no_content }
    end
  end

  def self.fetch_all_searchable_elements
    all_searchable_elements = {}

    StudentsController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "Student"
    end
    LocationsController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "Location"
    end
    StudiesController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "Study"
    end
    TeachingUnitsController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "TeachingUnit"
    end
    DisciplinesController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "Discipline"
    end
    DepartmentsController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "Department"
    end
    DegreesController.fetch_accessable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "Degree"
    end
    FederalStatesController.fetch_searchable_attributes.each do |attribute|
      all_searchable_elements[attribute] = "FederalState"
    end

    all_searchable_elements
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_search
      @search = Search.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def search_params
      params.require(:search).permit(:federal_state_name, :grade, :number_of_semester, :number_of_semesters, :discipline_name, :graduation_status, :gender, :nationality, :location_name, :minimum_age, :maximum_age, :search_category, :search_series, :department_number, :teaching_unit_name, :kind_of_degree)
    end
end
