class RemoveNameFromExperiments < ActiveRecord::Migration
  def up
    remove_column :experiments, :name
  end

  def down
    add_column :experiments, :name, :string
  end
end
