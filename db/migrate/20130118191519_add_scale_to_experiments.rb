class AddScaleToExperiments < ActiveRecord::Migration
  def change
    add_column :experiments, :scale_x0, :float

    add_column :experiments, :scale_x1, :float

    add_column :experiments, :scale_length_known, :float

    add_column :experiments, :scale_unit, :string

  end
end
