class ExperimentsController < ApplicationController
  # GET /experiments
  # GET /experiments.json
  def index
    @experiments = Experiment.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @experiments }
    end
  end

  # GET /experiments/1
  # GET /experiments/1.json
  def show
    @experiment = Experiment.find(params[:id])

    gon.test = 'testing'

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @experiment }
    end
  end

  # GET /experiments/new
  # GET /experiments/new.json
  def new
    @experiment = Experiment.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @experiment }
    end
  end

  # GET /experiments/1/edit
  def edit
    @experiment = Experiment.find(params[:id])
  end

  # POST /experiments
  # POST /experiments.json
  def create
    @experiment = Experiment.new(params[:experiment])

    respond_to do |format|
      if @experiment.save
        format.html { redirect_to @experiment, notice: 'Experiment was successfully created.' }
        format.json { render json: @experiment, status: :created, location: @experiment }
      else
        format.html { render action: "new" }
        format.json { render json: @experiment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /experiments/1
  # PUT /experiments/1.json
  def update
    @experiment = Experiment.find(params[:id])

    respond_to do |format|
      if @experiment.update_attributes(params[:experiment])
        format.html { redirect_to '/experiments/' + @experiment.id.to_s + '/clicker', notice: 'Experiment was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @experiment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /experiments/1
  # DELETE /experiments/1.json
  def destroy
    @experiment = Experiment.find(params[:id])
    @experiment.destroy

    respond_to do |format|
      format.html { redirect_to experiments_url }
      format.json { head :no_content }
    end
  end

  # GET /experiments/:id/analyze
  def inducks
    @experiment = Experiment.find(params[:id])
    @frames = Frame.where(:videoclip_id => params[:videoclip_id]).order('frames.framenum ASC')

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @videoclips }
    end
  end

  # GET /experiments/:id/clicker
  def clicker
    @experiment = Experiment.find(params[:id])
    
    clip  = @experiment.videoclip

    gon.experiment_id = @experiment.id
    gon.particle_id   = @experiment.particles.collect {|p| p.id}

    # HACK
    gon.particle_colors = @experiment.particles.collect{|p| [p.id, p.color_name]}.inject({}){ |r,el| r[el.first] = el.last; r }

    gon.framenum_min = clip.frames.order("framenum ASC").first.framenum
    gon.framenum_max = clip.frames.order("framenum DESC").first.framenum
    gon.clip_path    = File.join("../../../","data","video",clip.path)
    gon.frame_path   = File.join("frame", "%04d.jpg" % gon.framenum_min)
    gon.imgurl       = File.join(gon.clip_path, gon.frame_path)
    gon.fps          = clip.fpss.to_f

    respond_to do |format|
      format.html # experiments/clicker.html.erb
      format.json { head :no_content }
    end
  end

  # POST /experiments/:id/set_scale
  def set_scale
    @experiment = Experiment.find(params[:id])
    if @experiment.scale.nil?
      s = Scale.new(params[:scale])
      s.save
      @experiment.scale = s
    else
      @experiment.scale.update_attributes(params[:scale])
    end
    respond_to do |format|
      format.xml { render :inline => "<xml><status>OK</status></xml>" }
    end
  end

end
