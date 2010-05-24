# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100521153532) do

  create_table "profiles", :force => true do |t|
    t.string   "fullname"
    t.date     "dob"
    t.text     "about"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "projects", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.string   "state",       :default => "Active"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.date     "deadline"
  end

  create_table "roles", :force => true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles_users", :id => false, :force => true do |t|
    t.integer  "user_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", :force => true do |t|
    t.integer  "project_id"
    t.text     "description"
    t.integer  "user_id"
    t.integer  "priority",    :default => 0
    t.date     "deadline"
    t.string   "state",       :default => "Waiting"
    t.string   "assigned_by"
    t.integer  "hours_spent", :default => 0
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "email"
    t.string   "password_hash"
    t.string   "password_salt"
    t.string   "state",         :default => "Active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
