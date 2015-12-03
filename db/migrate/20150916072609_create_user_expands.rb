class CreateUserExpands < ActiveRecord::Migration
  def change
    create_table :user_expands do |t|
      t.references :user, index: true
      t.string :expand_name
      t.string :expand_value

      t.timestamps
    end
  end
end
