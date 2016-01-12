class Admin::PlacesController < ApplicationController
  before_action :set_place, only: [:show, :edit, :update, :destroy]

  # GET /admin/places
  # GET /admin/places.json
  def index
    @places = Place.all
  end

  # GET /admin/places/1
  # GET /admin/places/1.json
  def show
  end

  # GET /admin/places/new
  def new
    @place = Place.new
  end

  # GET /admin/places/1/edit
  def edit
  end

  # POST /admin/places
  # POST /admin/places.json
  def create
    @place = Place.new(place_params)

    respond_to do |format|
      if @place.save
        format.html { redirect_to [:admin, @place], notice: 'Place was successfully created.' }
        format.json { render action: 'show', status: :created, location: @place }
      else
        format.html { render action: 'new' }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/places/1
  # PATCH/PUT /admin/places/1.json
  def update
    respond_to do |format|
      if @place.update(place_params)
        format.html { redirect_to [:admin, @place], notice: 'Place was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/places/1
  # DELETE /admin/places/1.json
  def destroy
    @place.destroy
    respond_to do |format|
      format.html { redirect_to admin_places_url, notice: 'Place was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_params
      params[:place]
    end
end
