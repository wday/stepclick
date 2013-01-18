class CreateScales < ActiveRecord::Migration
  def change
    create_table :scales do |t|
      t.integer :experiment_id
      t.float :x0
      t.float :y0
      t.float :x1
      t.float :y1
      t.float :measured_length
      t.string :measured_units

      t.timestamps
    end
  end
end
