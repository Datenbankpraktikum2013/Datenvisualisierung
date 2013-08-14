class FederalStatesController < ApplicationController
  before_action :set_federal_state, only: [:show, :edit, :update, :destroy]

  # GET /federal_states
  # GET /federal_states.json
  def index
    @federal_states = FederalState.all
  end

  # GET /federal_states/1
  # GET /federal_states/1.json
  def show
  end

  # GET /federal_states/new
  def new
    @federal_state = FederalState.new
  end

  # GET /federal_states/1/edit
  def edit
  end

  # POST /federal_states
  # POST /federal_states.json
  def create
    @federal_state = FederalState.new(federal_state_params)

    respond_to do |format|
      if @federal_state.save
        format.html { redirect_to @federal_state, notice: 'Federal state was successfully created.' }
        format.json { render action: 'show', status: :created, location: @federal_state }
      else
        format.html { render action: 'new' }
        format.json { render json: @federal_state.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /federal_states/1
  # PATCH/PUT /federal_states/1.json
  def update
    respond_to do |format|
      if @federal_state.update(federal_state_params)
        format.html { redirect_to @federal_state, notice: 'Federal state was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @federal_state.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /federal_states/1
  # DELETE /federal_states/1.json
  def destroy
    @federal_state.destroy
    respond_to do |format|
      format.html { redirect_to federal_states_url }
      format.json { head :no_content }
    end
  end

  def self.fetch_groupable_attributes
    ["federal_state_name"]
  end

  def self.fetch_searchable_attributes
    ["federal_state_name"]
  end

  def self.fetch_joinable_classes
    []
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_federal_state
      @federal_state = FederalState.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def federal_state_params
      params.require(:federal_state).permit(:federal_state_name, :federal_state_iso_code, :longitude, :latitude)
    end
end
