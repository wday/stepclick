class AddFrameSkipToExperiments < ActiveRecord::Migration
  def change
    add_column :experiments, :frame_skip, :integer

  end
end
