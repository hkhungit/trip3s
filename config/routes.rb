Rails.application.routes.draw do
  
  get 'auth/:provider/callback', to: 'session#create'
  get 'auth/failure', to: redirect('/')
  get 'signout',      to: 'session#destroy', as: 'signout'
  get 'login',        to: 'session#login',   as: 'login'
  get 'signin',       to: 'session#signin',  as: 'signin'

  resources :session, only: [:create, :destroy]
  get 'session/create'
  get 'session/destroy'

  resources :config_options

  resources :schedule_details

  resources :query_posts

  resources :query_expands

  resources :queries

  resources :crawlers
  resources :api do
    member do
      get 'javo_map_list' 
      get 'index'
      post 'index'

      get 'return_day'
    end
    collection do
      get 'record'
      get 'trip3sReset'
      post 'trip3sReset'
      get 'trip3sPlan'
      post 'trip3sPlan'
      get 'get_placeIds'
      get 'get_create_plan'
      post 'get_create_plan'
      get 'k_mean'
      get 'add_to_plan'
      get 'load_place_filter'
      get 'load_plan'
      post 'add_day'
      get 'return_day'
      get 'javo_map_list'
      get 'javo_map_all' 
      get 'add_place_to_plan' 
      get 'trip3s_place_by_id'
      get 'index'
      post 'index'

    end
  end

  resources :post_expands

  resources :schedules

  resources :collection_details

  resources :places

  resources :plans do
    collection do
      get 'k_mean'
    end
  end

  resources :post_images

  resources :image_categories

  resources :images

  resources :user_posts

  resources :comments

  resources :user_expands

  resources :users

  resources :post_categories

  resources :posts

  resources :types

  resources :categories
  root 'home#index' 
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
