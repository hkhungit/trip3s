class QueryExpandsController < ApplicationController
  before_action :set_query_expand, only: [:show, :edit, :update, :destroy]

  # GET /query_expands
  # GET /query_expands.json
  def index
    @query_expands = QueryExpand.all
  end

  # GET /query_expands/1
  # GET /query_expands/1.json
  def show
  end

  # GET /query_expands/new
  def new
    @query_expand = QueryExpand.new
  end

  # GET /query_expands/1/edit
  def edit
  end

  # POST /query_expands
  # POST /query_expands.json
  def create
    @query_expand = QueryExpand.new(query_expand_params)

    respond_to do |format|
      if @query_expand.save
        format.html { redirect_to @query_expand, notice: 'Query expand was successfully created.' }
        format.json { render action: 'show', status: :created, location: @query_expand }
      else
        format.html { render action: 'new' }
        format.json { render json: @query_expand.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /query_expands/1
  # PATCH/PUT /query_expands/1.json
  def update
    respond_to do |format|
      if @query_expand.update(query_expand_params)
        format.html { redirect_to @query_expand, notice: 'Query expand was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @query_expand.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /query_expands/1
  # DELETE /query_expands/1.json
  def destroy
    @query_expand.destroy
    respond_to do |format|
      format.html { redirect_to query_expands_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_query_expand
      @query_expand = QueryExpand.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def query_expand_params
      params.require(:query_expand).permit(:query_id, :expand_name, :expand_value)
    end
end
