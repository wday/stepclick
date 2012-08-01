class SetProcessToFalseInVideoclips < ActiveRecord::Migration
	def change
		Videoclip.all.each do |clip|
			clip.update_attributes!(:is_processed => 0)
		end
	end
end
