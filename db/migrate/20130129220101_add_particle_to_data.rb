class AddParticleToData < ActiveRecord::Migration
  def change
    add_column :data, :particle_id, :integer

  end
end
