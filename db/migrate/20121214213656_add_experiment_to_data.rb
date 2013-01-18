class AddExperimentToData < ActiveRecord::Migration
  def change
  	add_column :data, :experiment_id, :integer
  end
end
