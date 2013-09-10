class AddDistanceColidsToExperiment < ActiveRecord::Migration
  def change
    add_column :experiments, :distance_colids, :string

  end
end
