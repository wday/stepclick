class CreateClips < ActiveRecord::Migration
  def change
    create_table :clips do |t|
      t.string :name
      t.string :path
      t.integer :num_frames
      t.integer :fps
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
