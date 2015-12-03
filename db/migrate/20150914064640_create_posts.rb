class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :post_title
      t.string :post_excerpt
      t.string :post_content
      t.string :post_status
      t.string :post_password
      t.string :post_parent
      t.string :post_type
      t.string :post_url
      t.string :post_view
      t.string :post_review
      t.string :post_point
      t.string :post_thumbnail
      t.timestamps
    end
  end
end
