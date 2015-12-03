class CreateImageCategories < ActiveRecord::Migration
  def change
    create_table :image_categories do |t|
      t.references :type, index: true
      t.references :image, index: true

      t.timestamps
    end
  end
end
