class AddFpsvaluesToVideoclip < ActiveRecord::Migration
  def change
    Videoclip.all.each do |clip|
      clip.update_attributes!(:fps => 29.97)
    end
  end
end
