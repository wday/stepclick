class CreateParticles < ActiveRecord::Migration
  def change
    create_table :particles do |t|
      t.integer :experiment_id
      t.string :name
      t.float :mass
      t.string :color_name

      t.timestamps
    end
  end
end
