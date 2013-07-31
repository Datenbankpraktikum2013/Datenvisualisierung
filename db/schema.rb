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

ActiveRecord::Schema.define(version: 20130731112414) do

  create_table "countries", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "degrees", force: true do |t|
    t.integer  "semester_of_deregistration"
    t.decimal  "grade",                      precision: 2, scale: 1
    t.integer  "number_of_semesters"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "departments", force: true do |t|
    t.string   "name"
    t.string   "number"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "disciplines", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "teaching_unit_id"
  end

  create_table "disciplines_studies", id: false, force: true do |t|
    t.integer "discipline_id", null: false
    t.integer "study_id",      null: false
  end

  create_table "federal_states", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "locations", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "federal_state_id"
    t.integer  "country_id"
    t.string   "data_warehouse_id"
  end

  create_table "students", force: true do |t|
    t.string   "gender"
    t.string   "matriculation_number"
    t.integer  "year_of_birth"
    t.string   "nationality"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "location_id"
  end

  create_table "studies", force: true do |t|
    t.integer  "semester_of_matriculation"
    t.string   "kind_of_degree"
    t.integer  "number_of_semester"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "student_id"
    t.integer  "degree_id"
  end

  create_table "teaching_units", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "department_id"
  end

end
