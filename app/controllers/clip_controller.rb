class ClipController < ApplicationController
  def index
    @clip = Clip.all
    respond_to do |format|
      format.html #-> index.html.erb
    end
  end
  def new
    @clip = Clip.new
    respond_to do |format|
      format.html #-> new.html.erb
    end
  end
end
