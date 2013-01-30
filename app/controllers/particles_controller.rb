class ParticlesController < ApplicationController

  # GET /experiments/:experiment_id/particles/:particle_id/plot
  def plot
    @experiment = Experiment.find params[:experiment_id]
    @particle   = @experiment.particles.find params[:id]
    @data       = @particle.data
    @scale      = @experiment.scale
    @colids    = ['x','y']
    @colors    = ['red','blue']

    gon.data       = @scale.get_scaled(@data)
    gon.experiment = @experiment
    gon.scale      = @scale
    gon.xcolid     = 'time'
    gon.colors     = @colors
    gon.colids     = @colids
    gon.plot_type  = 'raw'

    respond_to do |format|
      format.html
    end
  end

  # GET /experiments/:experiment_id/particles/:particle_id/distance
  def distance
    @experiment = Experiment.find params[:experiment_id]
    @particle   = @experiment.particles.find params[:id]
    @data       = @particle.data
    @scale      = @experiment.scale
    
    @colids = ['dx','dy','total_dx','total_dy']
    @colors = ['red','green','orange','purple','brown','black']

    gon.data       = ::ExperimentAnalyzer.compute_distance @scale.get_scaled(@data)
    gon.experiment = @experiment
    gon.scale      = @scale
    gon.colids     = @colids
    gon.xcolid     = 'time'
    gon.colors     = @colors
    gon.plot_type  = 'distance'

    respond_to do |format|
      format.html { render 'plot' }
    end
  end

  # POST /experiments/:experiment_id/particles/:id/add_datum
  def add_datum
    @experiment = Experiment.find params[:experiment_id]
    @particle   = @experiment.particles.find params[:id]
    @datum      = @particle.data.create params[:datum]
    respond_to do |format|
      if @datum.save
        format.xml { render :inline => "<xml><status>OK</status></xml>" }
      else
        format.xml { render :inline => "<xml><status>FAIL</status></xml>" }
      end
    end
  end

  # GET /particles
  # GET /particles.json
  def index
    @particles = Particle.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @particles }
    end
  end

  # GET /particles/1
  # GET /particles/1.json
  def show
    @particle = Particle.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @particle }
    end
  end

  # GET /experiment/:experiment_id/particles/new
  # GET /experiment/:experiment_id/particles/new.json
  def new
    @experiment = Experiment.find params[:experiment_id]
    @particle = @experiment.particles.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @particle }
    end
  end

  # GET /particles/1/edit
  def edit
    @particle = Particle.find(params[:id])
  end

  # POST /experiments/:experiment_id/particles
  # POST /experiments/:experiment_id/particles.json
  def create
    @experiment = Experiment.find params[:experiment_id]

    particle = @experiment.particles.create params[:particle]

    respond_to do |format|
      if particle.save
        format.html { redirect_to experiment_clicker_path(@experiment) }
      else
        format.html { render action: "new" }
      end
    end
  end

  # PUT /particles/1
  # PUT /particles/1.json
  def update
    @particle = Particle.find(params[:id])

    respond_to do |format|
      if @particle.update_attributes(params[:particle])
        format.html { redirect_to @particle, notice: 'Particle was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @particle.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /particles/1
  # DELETE /particles/1.json
  def destroy
    @particle = Particle.find(params[:id])
    @particle.destroy

    respond_to do |format|
      format.html { redirect_to particles_url }
      format.json { head :no_content }
    end
  end
end
