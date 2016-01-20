
Rails.application.routes.draw do
  
  namespace :admin do
  get 'baocao/diadiem'
  end

  namespace :admin do
  get 'baocao/kehoach'
  end

  namespace :admin do
  get 'homeadmin/index'
  end

  namespace :admin do
    resources :comments
  end

  namespace :admin do
    resources :categories
  end

  namespace :admin do
    resources :plans
  end

  namespace :admin do
    resources :dashboards
  end

  namespace :admin do
    resources :users
  end

  namespace :admin do
    resources :posts
  end

  namespace :admin do
    resources :places
  end

  get 'list/index'

  get 'auth/:provider/callback', to: 'session#create'
  
  get 'users/:id/plans', to: 'users#plans'

  get 'auth/failure', to: redirect('/')
  get 'signout',      to: 'session#destroy', as: 'signout'
  get 'login',        to: 'session#login',   as: 'login'
  get 'signin',       to: 'session#signin',  as: 'signin'

  get 'error',       to: 'api#error',  as: 'error'

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
      get 'get_plan'
      get 'plans'
      post 'plans'
      get 'getComment'
      post 'comment'
      get 'trip3s_user_by_id'
      get 'showVote'
      post 'vote'
      get 'upload_image'
      post 'upload_image'
      post 'friends'
      get 'response_user'
      post 'response_user'
      post 'detail_by_schedule_id'
      post 'add_friend'
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
      post 'update_infor'
      get 'item_district'
      post 'item_district'
      get 'item_area'
      post 'item_area'
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
      get 'search'
      post 'createPlan'
      get 'createPlan'
    end
  end

  resources :post_images

  resources :image_categories

  resources :images do
    collection do 
      get 'upload_image'
      post 'upload_image'
    end
  end

  resources :user_posts

 
  resources :user_expands

  resources :users do
    collection do
      get   'setting'
      post  'setting'
      get   'user-profile',       to: 'users#user_profile' 
      post  'user-profile',       to: 'users#user_profile' 
      get   'user-password',      to: 'users#user_password' 
      post  'user-password',      to: 'users#user_password' 
      get   'user-friends',       to: 'users#user_friend' 
      post  'user-friends',       to: 'users#user_friend' 
      get   'user-confirm',       to: 'users#user_confirm' 
      post  'user-confirm',       to: 'users#user_confirm' 
      get   'user-places',        to: 'users#user_places' 
      post  'user-places',        to: 'users#user_places' 
      get   'user-plans',         to: 'users#user_plans' 
      post  'user-plans',         to: 'users#user_plans' 
      get   'user-collections',   to: 'users#user_collections' 
      post  'user-collections',   to: 'users#user_collections' 
      get   'category-plan',      to: 'users#category_plan' 
      post  'category-plan',      to: 'users#category_plan' 
      get   'category-place',     to: 'users#category_place' 
      post  'category-place',     to: 'users#category_place' 
      get   'category-post',      to: 'users#category_post' 
      post  'category-post',      to: 'users#category_post' 
      get   'city',               to: 'users#category_city' 
      post  'city',               to: 'users#category_city' 
    end
  end
  resources :post_categories

 
  resources :posts do
    resources :comments
  end
  resources :types

  resources :categories
  root 'places#index' 
end
