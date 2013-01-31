set :application, "Motion Click"
set :repository,  "https://github.com/wday/stepclick.git"

set :scm, :git

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

server "alpha.ritesproject.net", :web, :app, :db, :primary => :true

set :deploy_to, "/home/deploy/sites/motionclick"
set :user, "deploy"

default_run_options[:shell] = '/bin/bash --login'

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
# end

# NOTE: this all assumes that deploy user is running passenger standalone 
#       on the currently deployed app in ~/sites/motionclick (or something like that)
# 
namespace :deploy do

	set :use_sudo, false

	task :start do ; end
	task :stop do ; end

	task :restart do
		run "cd #{deploy_to}; touch tmp/restart.txt"
	end

	desc "install required gems on remote"
	task :install_gems do
    	run "cd #{deploy_to}; bash --login -c 'bundle install'"
  	end

  	desc "print rvm info"
  	task :rvminfo do
  		run "cd #{deploy_to}; rvm info"
  	end

    # TODO set up production site to work with a normal capistrano configuration
  	desc "pull most recent from git"
  	task :update do
  		run "cd #{deploy_to}; [[ -f tmp/pids/passenger.3090.pid ]] && kill $(cat tmp/pids/passenger.3090.pid) || echo not running"
  		run "cd #{deploy_to}; rake assets:clean"
        # HACK since migration is generating this in the effective 'current'
        run "cd #{deploy_to}; git checkout -- db/schema.rb"
  		run "cd #{deploy_to}; git pull -u origin bootstrap"
  		migrate_production
  		install_gems
  		run "cd #{deploy_to}; rake assets:precompile"
  		run "cd #{deploy_to}; passenger start -eproduction -p 3090 -d"
  	end

  	desc "migrate remote db"
  	task :migrate_production do
  		run "cd #{deploy_to}; RAILS_ENV=production rake db:migrate"
  	end

  task :process_videos do
    run "cd #{deploy_to}; ./process-videos.rb"
  end

end
