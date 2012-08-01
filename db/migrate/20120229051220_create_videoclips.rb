class CreateVideoclips < ActiveRecord::Migration
  def change
    create_table :videoclips do |t|
      t.string :name
      t.string :path
      t.integer :frames
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
