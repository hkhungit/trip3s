class CreateQueries < ActiveRecord::Migration
  def change
    create_table :queries do |t|
      t.references :crawler, index: true
      t.integer :crawler_time
      t.string :post_title
      t.string :post_excerpt
      t.string :post_content
      t.string :post_password
      t.integer :post_parent
      t.string :post_type
      t.integer :post_view
      t.integer :post_review
      t.integer :post_point
      t.string :post_thumbnail

      t.timestamps
    end
  end
end
