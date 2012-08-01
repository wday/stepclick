class AddFpsToVideoclip < ActiveRecord::Migration
  def change
    add_column :videoclips, :fps, :float
  end
end
