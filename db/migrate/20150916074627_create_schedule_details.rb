class CreateScheduleDetails < ActiveRecord::Migration
  def change
    create_table :schedule_details do |t|
      t.references :place, index: true
      t.references :schedule, index: true
      t.string :place_name
      t.string :place_spend
      t.string :place_note, :limit => 4294967295 
      t.string :place_img,:limit => 65535  
      t.string :place_in
      t.string :place_lat
      t.string :place_lng
      t.integer :place_type
      t.string :place_out
      t.string :next_time
      t.string :next_distance

      t.timestamps
    end
  end
end
