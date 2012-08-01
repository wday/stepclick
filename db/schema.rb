# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120305152532) do

  create_table "clips", :force => true do |t|
    t.string   "name"
    t.string   "path"
    t.integer  "num_frames"
    t.integer  "fps"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "frames", :force => true do |t|
    t.integer  "framenum"
    t.integer  "videoclip_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "frames", ["videoclip_id"], :name => "index_frames_on_videoclip_id"

  create_table "videoclips", :force => true do |t|
    t.string   "name"
    t.string   "path"
    t.integer  "frames"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.integer  "is_processed"
    t.text     "description"
    t.float    "fps"
    t.string   "fpss"
    t.integer  "is_removed"
  end

end
