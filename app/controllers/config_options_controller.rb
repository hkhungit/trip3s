class ConfigOptionsController < ApplicationController
  before_action :set_config_option, only: [:show, :edit, :update, :destroy]

  # GET /config_options
  # GET /config_options.json
  def index
    @config_options = ConfigOption.all
  end

  # GET /config_options/1
  # GET /config_options/1.json
  def show
  end

  # GET /config_options/new
  def new
    @config_option = ConfigOption.new
  end

  # GET /config_options/1/edit
  def edit
  end

  # POST /config_options
  # POST /config_options.json
  def create
    @config_option = ConfigOption.new(config_option_params)

    respond_to do |format|
      if @config_option.save
        format.html { redirect_to @config_option, notice: 'Config option was successfully created.' }
        format.json { render action: 'show', status: :created, location: @config_option }
      else
        format.html { render action: 'new' }
        format.json { render json: @config_option.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /config_options/1
  # PATCH/PUT /config_options/1.json
  def update
    respond_to do |format|
      if @config_option.update(config_option_params)
        format.html { redirect_to @config_option, notice: 'Config option was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @config_option.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /config_options/1
  # DELETE /config_options/1.json
  def destroy
    @config_option.destroy
    respond_to do |format|
      format.html { redirect_to config_options_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_config_option
      @config_option = ConfigOption.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def config_option_params
      params.require(:config_option).permit(:config_name, :config_value)
    end
end
