class CreatePostImages < ActiveRecord::Migration
  def change
    create_table :post_images do |t|
      t.references :image, index: true
      t.references :post, index: true

      t.timestamps
    end
  end
end
