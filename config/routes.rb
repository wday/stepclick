Video::Application.routes.draw do

  resources :experiments do
    member do
      post 'set_scale'
    end
    member do
      get 'plot'
    end
    member do 
      get 'distance'
    end
    resources :particles do
      member do
        post 'add_datum'
      end
      member do
        get 'plot'
      end
      member do
        get 'distance'
      end
      resources :data
    end
    resources :scales
  end

  resources :videoclips do
    resources :frames
    member do
      get 'create_frames'
    end
		member do
			get 'soft_delete'
		end
    member do
      get 'start_experiment'
    end
    member do
      get 'play'
    end
  end

  root :to => 'videoclips#index'

#  resources :clip

  # use this as create_frames_url(:id => videoclip.id)
#  match 'videoclips/:id/create_frames', :to => 'videoclips#create_frames', :as => :create_frames
  
  # use this as analyze_frames_url(:id => videoclip.id)
#  match 'videoclips/:id/analyze_frames', :to => 'videoclips#analyze_frames', :as => :analyze_frames

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  #match 'videoclips/:id/start_experiment' => 'videoclips#start_experiment'
  #match 'videoclips/:id/play' => 'videoclips#play'
  #match 'experiments/:id/analyze' => 'experiments#inducks'

  match 'experiments/:id/clicker' => 'experiments#clicker', :as => :experiment_clicker
  #match 'experiments/:id/add_datum' => 'experiments#add_datum'
  #match 'experiments/:id/set_scale' => 'experiments#set_scale'
  #match 'experiments/:experiment_id/plot' => 'data#plot', :as => :experiment_plot
  #match 'experiments/:experiment_id/distance' => 'data#distance', :as => :experiment_distance_plot

  match 'test' => 'test#index'
  match 'ajaxtest/:id' => 'application#ajaxtest'

  # match 'results' => 'results#submit', :via => :post, :as => 'post_results'

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
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

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
