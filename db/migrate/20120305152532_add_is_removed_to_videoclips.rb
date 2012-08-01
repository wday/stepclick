class AddIsRemovedToVideoclips < ActiveRecord::Migration
  def change
    add_column :videoclips, :is_removed, :integer

		Videoclip.all.each do |clip|
			clip.update_attributes!(:is_removed => 0)
		end
  end
end
