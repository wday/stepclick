class AddFpsStrToVideoclips < ActiveRecord::Migration
  def change
    add_column :videoclips, :fpss, :string
		
		Videoclip.all.each do |clip|
			clip.update_attributes!(:fpss => "29.97")
		end
  end
end
