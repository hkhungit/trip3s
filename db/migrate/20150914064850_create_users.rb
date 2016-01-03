class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :user_name ,index: true
      t.string :user_pass
      t.string :user_email
      t.datetime :user_register
      t.string :user_activation
      t.string :user_status
      t.string :user_display
      t.string :user_thumbnail

      t.timestamps
    end
  end
end
