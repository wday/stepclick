class ClickerController < ApplicationController
  # GET /videoclips/:videoclip_id/clicker
  # GET /videoclips/:videoclip_id/clicker.json
  def index
    @frames = Frame.where(:videoclip_id => params[:videoclip_id]).order('frames.framenum ASC')

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @videoclips }
    end
  end

end
