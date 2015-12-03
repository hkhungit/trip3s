class CreateQueryExpands < ActiveRecord::Migration
  def change
    create_table :query_expands do |t|
      t.references :query, index: true
      t.string :expand_name
      t.string :expand_value

      t.timestamps
    end
  end
end
