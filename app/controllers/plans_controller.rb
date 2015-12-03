class PlansController < ApplicationController
  before_action :set_plan, only: [:show, :edit, :update, :destroy]
  layout "trip3s", only: [:index]
  layout "trip3s_plan_new", only: [:new,:create]
  # GET /plans
  # GET /plans.json
  def index
    @plans = Plan.all
  end

  # GET /plans/1
  # GET /plans/1.json
  def show
  end

  def k_mean
    
  end
  # GET /plans/new
  def new
    @plan = Plan.new
    @places_city      = Category.select("*").joins(:type).where(:types => {:type_name => 'type_city'}) 
    @places_purpose   = Category.select("*").joins(:type).where(:types => {:type_name => 'type_purpose_place'}) 
    @places_cuisine   = Category.select("*").joins(:type).where(:types => {:type_name => 'type_cuisine_place'}) 
    @places_property  = Category.select("*").joins(:type).where(:types => {:type_name => 'type_property_place'}) 
    @places_diding    = Category.select("*").joins(:type).where(:types => {:type_name => 'type_diding_place'}) 
    @places_area      = Category.select("*").joins(:type).where(:types => {:type_name => 'type_area'}) 
    @places_category  = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'}) 
    @district_category= Category.select("*").joins(:type).where(:types => {:type_name => 'type_district',:type_parent => '123'}) 
    @places  = Post.select("*").joins(:place).order('post_view desc')
  end

  # GET /plans/1/edit
  def edit
  end

  # POST /plans
  # POST /plans.json
  def create
    @plan = Plan.new(plan_params)

    respond_to do |format|
      if @plan.save
        format.html { redirect_to @plan, notice: 'Plan was successfully created.' }
        format.json { render action: 'show', status: :created, location: @plan }
      else
        format.html { render action: 'new' }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /plans/1
  # PATCH/PUT /plans/1.json
  def update
    respond_to do |format|
      if @plan.update(plan_params)
        format.html { redirect_to @plan, notice: 'Plan was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /plans/1
  # DELETE /plans/1.json
  def destroy
    @plan.destroy
    respond_to do |format|
      format.html { redirect_to plans_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_plan
      @plan = Plan.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def plan_params
      params.require(:plan).permit(:post_id, :plan_day, :plan_start, :plan_end, :plan_money, :plan_spend)
    end
end
