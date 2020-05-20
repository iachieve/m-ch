Rails.application.routes.draw do
  root 'homepage#index'
    namespace :v1 do
      resources :categories, only: %i[index]
      resources :rewards
      patch 'categories/update_bulk', controller: 'categories', action: :update_bulk
  end
end
