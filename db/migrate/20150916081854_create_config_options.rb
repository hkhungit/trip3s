class CreateConfigOptions < ActiveRecord::Migration
  def change
    create_table :config_options do |t|
      t.string :config_name
      t.string :config_value

      t.timestamps
    end
  end
end
