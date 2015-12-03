class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.references :post, index: true
      t.string :place_lat
      t.string :place_lng
      t.string :place_ticket
      t.datetime :place_open
      t.datetime :place_close
      t.datetime :place_late
      t.string :place_choice

      t.string :place_min
      t.string :place_max
      t.string :place_time
      t.string :place_address
      t.string :place_phone
      t.timestamps
    end
  end
end
