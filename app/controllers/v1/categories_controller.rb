class V1::CategoriesController < ApplicationController
  def index
    categories =Category.includes(:rewards)
    render json: categories, include: ['rewards'], status: :ok, adapter: :json_api
  end

  def update_bulk
    # cat_ids = category_params.map{|c| c["id"]}
    # puts cat_ids
    # Category.upsert_all(category_params)
    CategoriesRewards.delete_all
    category_params.each do |cat|
      
      updateCat = Category.find(cat["id"])
        cat["rewards"].each do |reward|
          CategoriesRewards.create(reward_id: reward["id"], category_id: cat["id"])
        end
      updateCat.save
    end
    render json: {message: 'items saved succefully'}, status: :ok, adapter: :json_api
  end

  private
    def category_params
      params.fetch(:categories, {})
    end
end