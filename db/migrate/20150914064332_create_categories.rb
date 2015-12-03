class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :cate_name
      t.string :cate_url
      t.string :cate_group
      t.string :cate_thumbnail

      t.timestamps
    end
  end
end
