class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.references :plan, index: true
      t.integer :schedule_day
      t.integer :schedule_action
      t.string :schedule_spend
      t.string :schedule_distance
      t.datetime :schedule_start
      t.datetime :schedule_end

      t.timestamps
    end
  end
end
