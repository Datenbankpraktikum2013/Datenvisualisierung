class StudiesController < ApplicationController
  before_action :set_study, only: [:show, :edit, :update, :destroy]

  # GET /studies
  # GET /studies.json
  def index
    @studies = Study.all
  end

  # GET /studies/1
  # GET /studies/1.json
  def show
  end

  # GET /studies/new
  def new
    @study = Study.new
  end

  # GET /studies/1/edit
  def edit
  end

  # POST /studies
  # POST /studies.json
  def create
    @study = Study.new(study_params)

    respond_to do |format|
      if @study.save
        format.html { redirect_to @study, notice: 'Study was successfully created.' }
        format.json { render action: 'show', status: :created, location: @study }
      else
        format.html { render action: 'new' }
        format.json { render json: @study.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /studies/1
  # PATCH/PUT /studies/1.json
  def update
    respond_to do |format|
      if @study.update(study_params)
        puts study_params
        format.html { redirect_to @study, notice: 'Study was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @study.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /studies/1
  # DELETE /studies/1.json
  def destroy
    @study.destroy
    respond_to do |format|
      format.html { redirect_to studies_url }
      format.json { head :no_content }
    end
  end

  def self.fetch_groupable_attributes
    ["kind_of_degree"]
  end

  def self.fetch_searchable_attributes
    ["kind_of_degree", "number_of_semester", "semester_of_matriculation"]
  end

  def self.fetch_joinable_classes
    ["Degree", "Discipline"]
  end

  def self.fetch_all_joinable_classes
    all_successors = fetch_joinable_classes
    fetch_joinable_classes.each do |class_name|
      controller_class = class_name.pluralize + "Controller"
      controller_class = controller_class.constantize
      all_successors += controller_class.fetch_all_joinable_classes
    end 
    all_successors
  end

  def self.join_to_degrees
    " JOIN degrees ON studies.degree_id = degrees.id"
  end

  def self.join_to_disciplines
    " JOIN disciplines_studies ON disciplines_studies.study_id = studies.id JOIN disciplines ON disciplines_studies.discipline_id = disciplines.id"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_study
      @study = Study.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def study_params
      params.require(:study).permit(:semester_of_matriculation, :kind_of_degree, :number_of_semester, :student_id, :degree_id, discipline_ids: [])
    end
end
