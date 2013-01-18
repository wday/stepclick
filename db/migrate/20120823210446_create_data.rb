class CreateData < ActiveRecord::Migration
  def change
    create_table :data do |t|
      t.integer :results_id
      t.integer :frame
      t.float :time
      t.float :x
      t.float :y

      t.timestamps
    end
  end
end
