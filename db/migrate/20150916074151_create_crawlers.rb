class CreateCrawlers < ActiveRecord::Migration
  def change
    create_table :crawlers do |t|
      t.string :title
      t.string :source
      t.string :forward

      t.timestamps
    end
  end
end
