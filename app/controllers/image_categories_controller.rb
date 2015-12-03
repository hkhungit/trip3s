class ImageCategoriesController < ApplicationController
  before_action :set_image_category, only: [:show, :edit, :update, :destroy]

  # GET /image_categories
  # GET /image_categories.json
  def index
    @image_categories = ImageCategory.all
  end

  # GET /image_categories/1
  # GET /image_categories/1.json
  def show
  end

  # GET /image_categories/new
  def new
    @image_category = ImageCategory.new
  end

  # GET /image_categories/1/edit
  def edit
  end

  # POST /image_categories
  # POST /image_categories.json
  def create
    @image_category = ImageCategory.new(image_category_params)

    respond_to do |format|
      if @image_category.save
        format.html { redirect_to @image_category, notice: 'Image category was successfully created.' }
        format.json { render action: 'show', status: :created, location: @image_category }
      else
        format.html { render action: 'new' }
        format.json { render json: @image_category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /image_categories/1
  # PATCH/PUT /image_categories/1.json
  def update
    respond_to do |format|
      if @image_category.update(image_category_params)
        format.html { redirect_to @image_category, notice: 'Image category was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @image_category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /image_categories/1
  # DELETE /image_categories/1.json
  def destroy
    @image_category.destroy
    respond_to do |format|
      format.html { redirect_to image_categories_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_image_category
      @image_category = ImageCategory.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def image_category_params
      params.require(:image_category).permit(:type_id, :image_id)
    end
end
