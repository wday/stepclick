# encoding: UTF-8
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

ActiveRecord::Schema.define(:version => 20130129220101) do

  create_table "analyzers", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

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

  create_table "data", :force => true do |t|
    t.integer  "results_id"
    t.integer  "frame"
    t.float    "time"
    t.float    "x"
    t.float    "y"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.integer  "particle_id"
  end

  create_table "experiments", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    t.integer  "videoclip_id"
    t.float    "scale_x0"
    t.float    "scale_x1"
    t.float    "scale_length_known"
    t.string   "scale_unit"
    t.integer  "frame_skip"
  end

  create_table "frames", :force => true do |t|
    t.integer  "framenum"
    t.integer  "videoclip_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "frames", ["videoclip_id"], :name => "index_frames_on_videoclip_id"

  create_table "particles", :force => true do |t|
    t.integer  "experiment_id"
    t.string   "name"
    t.float    "mass"
    t.string   "color_name"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "results", :force => true do |t|
    t.text     "notes"
    t.text     "data"
    t.integer  "videoclip_id"
    t.string   "units"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "scales", :force => true do |t|
    t.integer  "experiment_id"
    t.float    "x0"
    t.float    "y0"
    t.float    "x1"
    t.float    "y1"
    t.float    "measured_length"
    t.string   "measured_units"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "videoclips", :force => true do |t|
    t.string   "name"
    t.string   "path"
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
