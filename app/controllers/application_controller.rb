class ApplicationController < ActionController::Base
  protect_from_forgery

  def ajaxtest
  	respond_to do |format|
  		format.xml { render :inline => "<xml><node id=\"" + @params[:id] + "\"></node></xml>" }
  	end
  end
end
