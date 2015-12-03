class CreateScheduleDetails < ActiveRecord::Migration
  def change
    create_table :schedule_details do |t|
      t.references :place, index: true
      t.references :schedule, index: true
      t.string :place_name
      t.string :place_spend
      t.datetime :place_in
      t.datetime :place_out
      t.string :next_time
      t.string :next_distance

      t.timestamps
    end
  end
end
