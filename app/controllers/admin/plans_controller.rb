class Admin::PlansController < ApplicationController
  before_action :set_plan, only: [:show, :edit, :update, :destroy]
  layout "admin"
  # GET /admin/plans
  # GET /admin/plans.json
  def index
    @plans = Plan.all.paginate(page: params[:page])
  end

  # GET /admin/plans/1
  # GET /admin/plans/1.json
  def show
  end

  # GET /admin/plans/new
  def new
    @plan = Plan.new
  end

  # GET /admin/plans/1/edit
  def edit
  end

  # POST /admin/plans
  # POST /admin/plans.json
  def create
    @plan = Plan.new(plan_params)

    respond_to do |format|
      if @plan.save
        format.html { redirect_to [:admin, @plan], notice: 'Plan was successfully created.' }
        format.json { render action: 'show', status: :created, location: @plan }
      else
        format.html { render action: 'new' }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/plans/1
  # PATCH/PUT /admin/plans/1.json
  def update
    respond_to do |format|
      if @plan.update(plan_params)
        format.html { redirect_to [:admin, @plan], notice: 'Plan was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/plans/1
  # DELETE /admin/plans/1.json
  def destroy
    @plan.destroy
    respond_to do |format|
      format.html { redirect_to admin_plans_url, notice: 'Plan was successfully destroyed.' }
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
