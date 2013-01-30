class RemoveExperimentFromData < ActiveRecord::Migration
  def up
    remove_column :data, :experiment_id
      end

  def down
    add_column :data, :experiment_id, :integer
  end
end
