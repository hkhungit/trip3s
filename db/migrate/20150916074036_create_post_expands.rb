class CreatePostExpands < ActiveRecord::Migration
  def change
    create_table :post_expands do |t|
      t.references :post, index: true
      t.string :expand_name
      t.string :expand_value

      t.timestamps
    end
  end
end
