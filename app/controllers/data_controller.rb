class DataController < ApplicationController
 
  # GET /experiments/:experiment_id/plot
  def plot
    if params.has_key?(:experiment_id)
      @data      = Datum.where :experiment_id => params[:experiment_id]
      experiment = Experiment.find params[:experiment_id]
      scale      = experiment.scale
      @colids    = ['x','y']
      @colors    = ['red','blue']
    else
      @data = nil
    end
    respond_to do |format|
      if @data
        gon.data       = scale.get_scaled(@data)
        gon.experiment = experiment
        gon.scale      = scale
        gon.xcolid     = 'time'
        gon.colors     = @colors
        gon.colids     = @colids
        format.html
      else
        format.html redirect_to experiment_clicker_path(@data.experiment), :flash => {:error => 'Measure scale before plotting'}
      end
    end
  end

  # GET /experiments/:experiment_id/distance
  def distance
    if params.has_key? :experiment_id
      @data = Datum.where :experiment_id => params[:experiment_id]
      experiment = Experiment.find params[:experiment_id]
      scale = experiment.scale
      @colids = ['dx','dy','total_dx','total_dy','distance','total_distance']
      @colors = ['red','green','orange','purple','brown','black']
    else 
      @data = nil
    end

    respond_to do |format|
      if @data
        gon.data       = ::ExperimentAnalyzer.compute_distance scale.get_scaled(@data)
        gon.experiment = experiment
        gon.scale      = scale
        gon.colids     = @colids
        gon.xcolid     = 'time'
        gon.colors     = @colors
        format.html { render 'plot' }
      else
        format.html redirect_to experiment_clicker_path(@data.experiment), :flash => {:error => 'Measure scale before plotting'}
      end
    end
  end

  # GET /data
  # GET /data.json
  # TODO accept ?argument to determine whether to render raw or scaled results
  def index

    if params.has_key?(:experiment_id)
      @data = Datum.where :experiment_id => params[:experiment_id]
    else
      render :bad_request
    end

    respond_to do |format|
      if not @data.empty? and @data.first.experiment.scale.nil? 
        format.html { 
          redirect_to experiment_clicker_path(@data.first.experiment), :flash => {:error => 'Measure scale before viewing data'} 
        }
      else
        if not @data.empty?
          format.html
        else
          redirect_to experiments_path
        end
        format.json { render json: @data }
        format.csv {
          # TODO add helper method to Datum class results = Datum::to_results(data)
          results = []
          @data.each { |datum| 
            results << { 
              "frame" => datum.frame,
              "time (s)" => datum.time,
              "x (" + datum.experiment.scale.measured_units + ")" => datum.experiment.scale.x(datum.x), 
              "y (" + datum.experiment.scale.measured_units + ")" => datum.experiment.scale.y(datum.y),
            }
          }
          render 'shared/csvtable', :locals => { :results => results }
        }
      end
    end
  end

  # GET /data/1
  # GET /data/1.json
  def show
    @datum = Datum.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @datum }
    end
  end

  # GET /data/new
  # GET /data/new.json
  def new
    @datum = Datum.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @datum }
    end
  end

  # GET /data/1/edit
  def edit
    @datum = Datum.find(params[:id])
  end

  # POST /data
  # POST /data.json
  def create
    @datum = Datum.new(params[:datum])

    respond_to do |format|
      if @datum.save
        format.html { redirect_to @datum, notice: 'Datum was successfully created.' }
        format.json { render json: @datum, status: :created, location: @datum }
      else
        format.html { render action: "new" }
        format.json { render json: @datum.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /data/1
  # PUT /data/1.json
  def update
    @datum = Datum.find(params[:id])

    respond_to do |format|
      if @datum.update_attributes(params[:datum])
        format.html { redirect_to @datum, notice: 'Datum was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @datum.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /data/1
  # DELETE /data/1.json
  def destroy
    @datum = Datum.find(params[:id])
    @datum.destroy

    respond_to do |format|
      format.html { redirect_to data_url }
      format.json { head :no_content }
    end
  end
end
