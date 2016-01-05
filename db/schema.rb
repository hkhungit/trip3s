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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151104092548) do

  create_table "categories", force: true do |t|
    t.string   "cate_name"
    t.string   "cate_url"
    t.string   "cate_group"
    t.string   "cate_thumbnail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "collection_details", force: true do |t|
    t.integer  "post_id"
    t.integer  "place_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "collection_details", ["place_id"], name: "index_collection_details_on_place_id", using: :btree
  add_index "collection_details", ["post_id"], name: "index_collection_details_on_post_id", using: :btree

  create_table "comments", force: true do |t|
    t.integer  "post_id"
    t.integer  "user_id"
    t.string   "comment_author"
    t.string   "comment_author_email"
    t.string   "comment_author_url"
    t.string   "comment_author_ip"
    t.string   "comment_content"
    t.string   "comment_status"
    t.integer  "comment_parent"
    t.integer  "comment_review"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "comments", ["post_id"], name: "index_comments_on_post_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "config_options", force: true do |t|
    t.string   "config_name"
    t.string   "config_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "crawlers", force: true do |t|
    t.string   "title"
    t.string   "source"
    t.string   "forward"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "image_categories", force: true do |t|
    t.integer  "type_id"
    t.integer  "image_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "image_categories", ["image_id"], name: "index_image_categories_on_image_id", using: :btree
  add_index "image_categories", ["type_id"], name: "index_image_categories_on_type_id", using: :btree

  create_table "images", force: true do |t|
    t.string   "image_title"
    t.string   "image_url"
    t.string   "image_alt"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "places", force: true do |t|
    t.integer  "post_id"
    t.decimal  "place_lat",                 precision: 10, scale: 6
    t.decimal  "place_lng",                 precision: 10, scale: 6
    t.decimal  "place_ticket",              precision: 10, scale: 2, default: 0.0
    t.string   "place_open",    limit: 200,                          default: "07:00:00"
    t.string   "place_close",   limit: 200,                          default: "17:59:59"
    t.string   "place_late",    limit: 200,                          default: "17:30:00"
    t.float    "place_choice",  limit: 24,                           default: 0.1
    t.decimal  "place_min",                 precision: 10, scale: 2, default: 0.0
    t.decimal  "place_max",                 precision: 10, scale: 2, default: 0.0
    t.float    "place_time",    limit: 24,                           default: 0.0
    t.text     "place_address"
    t.string   "place_phone",   limit: 20
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "places", ["post_id"], name: "index_places_on_post_id", using: :btree

  create_table "plans", force: true do |t|
    t.integer  "post_id"
    t.integer  "plan_day"
    t.datetime "plan_start"
    t.datetime "plan_end"
    t.decimal  "plan_money", precision: 10, scale: 2, default: 0.0
    t.decimal  "plan_spend", precision: 10, scale: 2, default: 0.0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "plans", ["post_id"], name: "index_plans_on_post_id", using: :btree

  create_table "post_categories", force: true do |t|
    t.integer  "type_id"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "post_categories", ["post_id"], name: "index_post_categories_on_post_id", using: :btree
  add_index "post_categories", ["type_id"], name: "index_post_categories_on_type_id", using: :btree

  create_table "post_expands", force: true do |t|
    t.integer  "post_id"
    t.string   "expand_name"
    t.string   "expand_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "post_expands", ["post_id"], name: "index_post_expands_on_post_id", using: :btree

  create_table "post_images", force: true do |t|
    t.integer  "image_id"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "post_images", ["image_id"], name: "index_post_images_on_image_id", using: :btree
  add_index "post_images", ["post_id"], name: "index_post_images_on_post_id", using: :btree

  create_table "posts", force: true do |t|
    t.string   "post_title"
    t.text     "post_excerpt",   limit: 16777215
    t.text     "post_content",   limit: 2147483647
    t.string   "post_status"
    t.string   "post_password"
    t.string   "post_parent"
    t.string   "post_type"
    t.string   "post_url"
    t.string   "post_view"
    t.string   "post_review"
    t.string   "post_point"
    t.text     "post_thumbnail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "queries", force: true do |t|
    t.integer  "crawler_id"
    t.integer  "crawler_time"
    t.string   "post_title"
    t.string   "post_excerpt"
    t.string   "post_content"
    t.string   "post_password"
    t.integer  "post_parent"
    t.string   "post_type"
    t.integer  "post_view"
    t.integer  "post_review"
    t.integer  "post_point"
    t.string   "post_thumbnail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "queries", ["crawler_id"], name: "index_queries_on_crawler_id", using: :btree

  create_table "query_expands", force: true do |t|
    t.integer  "query_id"
    t.string   "expand_name"
    t.string   "expand_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "query_expands", ["query_id"], name: "index_query_expands_on_query_id", using: :btree

  create_table "query_posts", force: true do |t|
    t.integer  "query_id"
    t.integer  "post_id"
    t.datetime "focus_time"
    t.integer  "focus_late"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "query_posts", ["post_id"], name: "index_query_posts_on_post_id", using: :btree
  add_index "query_posts", ["query_id"], name: "index_query_posts_on_query_id", using: :btree

  create_table "record", force: true do |t|
    t.text    "name",    null: false
    t.integer "current", null: false
    t.integer "max",     null: false
  end

  create_table "schedule_details", force: true do |t|
    t.integer  "place_id"
    t.integer  "schedule_id"
    t.text     "place_name"
    t.decimal  "place_spend",                      precision: 10, scale: 2
    t.string   "place_in",      limit: 200,                                 default: "00:00:00"
    t.string   "place_out",     limit: 200
    t.text     "place_img"
    t.text     "place_note",    limit: 2147483647
    t.decimal  "place_lat",                        precision: 10, scale: 6
    t.decimal  "place_lng",                        precision: 10, scale: 6
    t.integer  "place_type",                                                                     null: false
    t.decimal  "next_time",                        precision: 10, scale: 2
    t.decimal  "next_distance",                    precision: 10, scale: 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "schedule_details", ["place_id"], name: "index_schedule_details_on_place_id", using: :btree
  add_index "schedule_details", ["schedule_id"], name: "index_schedule_details_on_schedule_id", using: :btree

  create_table "schedules", force: true do |t|
    t.integer  "plan_id"
    t.integer  "schedule_day"
    t.integer  "schedule_action"
    t.decimal  "schedule_spend",               precision: 10, scale: 2
    t.decimal  "schedule_distance",            precision: 10, scale: 2
    t.float    "schedule_start",    limit: 24
    t.float    "schedule_end",      limit: 24
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "schedules", ["plan_id"], name: "index_schedules_on_plan_id", using: :btree

  create_table "sessions", force: true do |t|
    t.string   "session_id",                    null: false
    t.text     "data",       limit: 2147483647
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "types", force: true do |t|
    t.string   "type_name"
    t.string   "type_description"
    t.string   "type_parent"
    t.integer  "type_count"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "types", ["category_id"], name: "index_types_on_category_id", using: :btree

  create_table "user_expands", force: true do |t|
    t.integer  "user_id"
    t.string   "expand_name"
    t.string   "expand_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_expands", ["user_id"], name: "index_user_expands_on_user_id", using: :btree

  create_table "user_posts", force: true do |t|
    t.integer  "post_id"
    t.integer  "user_id"
    t.integer  "permission"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_posts", ["post_id"], name: "index_user_posts_on_post_id", using: :btree
  add_index "user_posts", ["user_id"], name: "index_user_posts_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "user_name"
    t.text     "user_pass"
    t.string   "user_email"
    t.datetime "user_register"
    t.text     "user_activation"
    t.string   "user_status"
    t.string   "user_display"
    t.text     "user_thumbnail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
