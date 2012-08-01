class AddColumnsToVideoclips < ActiveRecord::Migration
  def change
    add_column :videoclips, :is_processed, :integer
    add_column :videoclips, :description, :text

    Videoclip.all.each do |clip|
      clip.update_attributes!(:is_processed => 1)
    end
  end
end
