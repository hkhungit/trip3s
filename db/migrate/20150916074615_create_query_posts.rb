class CreateQueryPosts < ActiveRecord::Migration
  def change
    create_table :query_posts do |t|
      t.references :query, index: true
      t.references :post, index: true
      t.datetime :focus_time
      t.integer :focus_late

      t.timestamps
    end
  end
end
