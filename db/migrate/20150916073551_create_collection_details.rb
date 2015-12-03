class CreateCollectionDetails < ActiveRecord::Migration
  def change
    create_table :collection_details do |t|
      t.references :post, index: true
      t.references :place, index: true

      t.timestamps
    end
  end
end
