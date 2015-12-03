class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :image_title
      t.string :image_url
      t.string :image_alt

      t.timestamps
    end
  end
end
