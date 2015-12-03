class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.references :post, index: true
      t.references :user, index: true
      t.string :comment_author
      t.string :comment_author_email
      t.string :comment_author_url
      t.string :comment_author_ip
      t.string :comment_content
      t.string :comment_status
      t.integer :comment_parent
      t.integer :comment_review

      t.timestamps
    end
  end
end
