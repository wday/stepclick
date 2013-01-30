class DataController < ApplicationController
 
  # GET /experiments/:experiment_id/particles/:particle_id/data
  # GET /experiments/:experiment_id/particles/:particle_id/data.json
  def index

    @experiment = Experiment.find params[:experiment_id]
    @particle   = @experiment.particles.find params[:particle_id]
    @data       = @particle.data
    @scale      = @experiment.scale

    respond_to do |format|
      if not @data.empty? and @experiment.scale.nil? 
        format.html { 
          redirect_to experiment_clicker_path(@experiment), :flash => {:error => 'Measure scale before viewing data'} 
        }
      else
        format.html
        format.json { render json: @data }
        format.csv {
          # TODO add helper method to Datum class results = Datum::to_results(data)
          results = []
          @data.each { |datum| 
            results << { 
              "frame" => datum.frame,
              "time (s)" => datum.time,
              "x (" + @scale.measured_units + ")" => @scale.x(datum.x), 
              "y (" + @scale.measured_units + ")" => @scale.y(datum.y),
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
