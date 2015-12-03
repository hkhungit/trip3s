class CreatePlans < ActiveRecord::Migration
  def change
    create_table :plans do |t|
      t.references :post, index: true
      t.integer :plan_day
      t.datetime :plan_start
      t.datetime :plan_end
      t.string :plan_money
      t.string :plan_end

      t.timestamps
    end
  end
end
