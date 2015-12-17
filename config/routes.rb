
Rails.application.routes.draw do
  
  get 'list/index'

  get 'auth/:provider/callback', to: 'session#create'
  get 'auth/failure', to: redirect('/')
  get 'signout',      to: 'session#destroy', as: 'signout'
  get 'login',        to: 'session#login',   as: 'login'
  get 'signin',       to: 'session#signin',  as: 'signin'

  resources :session, only: [:create, :destroy]
  get 'session/create'
  get 'session/destroy'

  get "search/index"
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

  resources :places do 
    collection do
      get 'search'
      get 'search_all'
      get 'resuft'
    end
  end

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
end
