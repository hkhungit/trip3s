class Admin::DashboardsController < ApplicationController
  before_action :set_dashboard, only: [:show, :edit, :update, :destroy]
  layout "admin"
  # GET /admin/dashboards
  # GET /admin/dashboards.json
  def index
    @dashboards = Dashboard.all
  end

  # GET /admin/dashboards/1
  # GET /admin/dashboards/1.json
  def show
  end

  # GET /admin/dashboards/new
  def new
    @dashboard = Dashboard.new
  end

  # GET /admin/dashboards/1/edit
  def edit
  end

  # POST /admin/dashboards
  # POST /admin/dashboards.json
  def create
    @dashboard = Dashboard.new(dashboard_params)

    respond_to do |format|
      if @dashboard.save
        format.html { redirect_to [:admin, @dashboard], notice: 'Dashboard was successfully created.' }
        format.json { render action: 'show', status: :created, location: @dashboard }
      else
        format.html { render action: 'new' }
        format.json { render json: @dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/dashboards/1
  # PATCH/PUT /admin/dashboards/1.json
  def update
    respond_to do |format|
      if @dashboard.update(dashboard_params)
        format.html { redirect_to [:admin, @dashboard], notice: 'Dashboard was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/dashboards/1
  # DELETE /admin/dashboards/1.json
  def destroy
    @dashboard.destroy
    respond_to do |format|
      format.html { redirect_to admin_dashboards_url, notice: 'Dashboard was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dashboard
      @dashboard = Dashboard.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dashboard_params
      params[:dashboard]
    end
end
