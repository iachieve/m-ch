class CategoriesRewards < ApplicationRecord
  belongs_to :category
  belongs_to :reward
end
