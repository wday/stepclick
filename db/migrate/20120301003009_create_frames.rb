class CreateFrames < ActiveRecord::Migration
  def change
    create_table :frames do |t|
      t.integer :framenum
      t.references :videoclip # e.g. the integer column :videoclip_id

      t.timestamps
    end
    add_index :frames, :videoclip_id
  end
end
