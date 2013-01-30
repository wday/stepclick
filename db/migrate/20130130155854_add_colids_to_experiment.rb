class AddColidsToExperiment < ActiveRecord::Migration
  def change
    add_column :experiments, :colids, :string

  end
end
