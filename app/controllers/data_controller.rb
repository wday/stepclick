class DataController < ApplicationController
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
      format.html # index.html.erb
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
