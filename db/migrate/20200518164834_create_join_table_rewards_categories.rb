class CreateJoinTableRewardsCategories < ActiveRecord::Migration[6.0]
  def change
    create_join_table :rewards, :categories do |t|
      # t.index [:reward_id, :category_id]
      # t.index [:category_id, :reward_id]
    end
  end
end
