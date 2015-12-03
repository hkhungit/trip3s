class CreateTypes < ActiveRecord::Migration
  def change
    create_table :types do |t|
      t.string :type_name
      t.string :type_description
      t.string :type_parent
      t.integer :type_count
      t.references :category, index: true

      t.timestamps
    end
  end
end
