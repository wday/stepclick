class RemoveFramesFromVideoclips < ActiveRecord::Migration
  def up
    remove_column :videoclips, :frames
      end

  def down
    add_column :videoclips, :frames, :integer
  end
end
