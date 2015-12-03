class CreateUserPosts < ActiveRecord::Migration
  def change
    create_table :user_posts do |t|
      t.references :post, index: true
      t.references :user, index: true
      t.integer :permission

      t.timestamps
    end
  end
end
