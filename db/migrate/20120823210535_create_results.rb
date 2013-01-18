class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.text :notes
      t.text :data
      t.integer :videoclip_id
      t.string :units

      t.timestamps
    end
  end
end
