class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.references :post, index: true
      t.string :place_lat
      t.string :place_lng
      t.string :place_ticket
      t.string :place_open
      t.string :place_close
      t.string :place_late
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
