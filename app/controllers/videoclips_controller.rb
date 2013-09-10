require 'uuid'

class VideoclipsController < ApplicationController
  # GET /videoclips
  # GET /videoclips.json
  def index
    @videoclips = Videoclip.all
    @show_all = params.has_key? 'debug'

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @videoclips }
    end
  end
  
  # GET /videoclips/1/create_frames
  # GET /videoclips/1/create_frames.json
  def create_frames
    @videoclip = Videoclip.find(params[:id])
    @videoclip.create_frames(@videoclip.path)

    redirect_to videoclips_path
  end

  # GET /videoclips/1/analyze_frames
  # GET /videoclips/1/analyze_frames.json
  def analyze_frames
    @videoclip = Videoclip.find(params[:id])

    respond_to do |format|
      format.html # analyze_frames.html.erb
      format.html { render :json => @videoclip }
    end
  end

  # GET /videoclips/1
  # GET /videoclips/1.json
  def show
    @videoclip = Videoclip.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @videoclip }
    end
  end

  # GET /videoclips/new
  # GET /videoclips/new.json
  def new
    @videoclip = Videoclip.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @videoclip }
    end
  end

  # GET /videoclips/1/edit
  def edit
    @videoclip = Videoclip.find(params[:id])
  end

  # POST /videoclips
  # POST /videoclips.json
  def create

    inpar = params[:videoclip]

    datafile = inpar[:datafile]

    inpar.delete :datafile

    uuid = UUID.new

    inpar["width"]  = -1;
    inpar["height"] = -1;
    inpar["path"]   = uuid.generate
    
    @videoclip = Videoclip.new(inpar)

    if @videoclip.save
      @videoclip.store_datafile(datafile,inpar["path"])
    end

    respond_to do |format|
      if @videoclip.save
        format.html { redirect_to videoclips_path, :notice => 'Videoclip was successfully created.' }
        format.json { render :json => @videoclip, :status => :created, :location => @videoclip }
      else
        format.html { render :action => "new" }
        format.json { render :json => @videoclip.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /videoclips/1
  # PUT /videoclips/1.json
  def update
    @videoclip = Videoclip.find(params[:id])

    respond_to do |format|
      if @videoclip.update_attributes(params[:videoclip])
        format.html { redirect_to '/', :notice => 'Videoclip was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @videoclip.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /videoclips/1
  # DELETE /videoclips/1.json
  def destroy
    puts 'NOTE -- Soft deleting and going home'
    @videoclip = Videoclip.find(params[:id])
    @videoclip.soft_delete

    redirect_to '/'
  end

  # GET /videoclips/:id/start_experiment
  def start_experiment
    experiment = Experiment.new
    videoclip = Videoclip.find(params[:id])
    experiment.videoclip_id = videoclip.id

    experiment.save

    #TODO redirect to clicker that saves data for this experiment
    redirect_to '/experiments/' + experiment.id.to_s + '/edit_before_clicker'
  end

  # GET /videoclips/:id/play
  def play
    @videoclip = Videoclip.find params[:id]
    respond_to do |format|
      format.html
    end
  end
end
