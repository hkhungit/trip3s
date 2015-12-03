class CollectionDetailsController < ApplicationController
  before_action :set_collection_detail, only: [:show, :edit, :update, :destroy]

  # GET /collection_details
  # GET /collection_details.json
  def index
    @collection_details = CollectionDetail.all
  end

  # GET /collection_details/1
  # GET /collection_details/1.json
  def show
  end

  # GET /collection_details/new
  def new
    @collection_detail = CollectionDetail.new
  end

  # GET /collection_details/1/edit
  def edit
  end

  # POST /collection_details
  # POST /collection_details.json
  def create
    @collection_detail = CollectionDetail.new(collection_detail_params)

    respond_to do |format|
      if @collection_detail.save
        format.html { redirect_to @collection_detail, notice: 'Collection detail was successfully created.' }
        format.json { render action: 'show', status: :created, location: @collection_detail }
      else
        format.html { render action: 'new' }
        format.json { render json: @collection_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /collection_details/1
  # PATCH/PUT /collection_details/1.json
  def update
    respond_to do |format|
      if @collection_detail.update(collection_detail_params)
        format.html { redirect_to @collection_detail, notice: 'Collection detail was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @collection_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /collection_details/1
  # DELETE /collection_details/1.json
  def destroy
    @collection_detail.destroy
    respond_to do |format|
      format.html { redirect_to collection_details_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_collection_detail
      @collection_detail = CollectionDetail.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def collection_detail_params
      params.require(:collection_detail).permit(:post_id, :place_id)
    end
end
