require File.expand_path('./lib/migrator.rb')

namespace :migrate do
	desc 'Here is a description of my task'
 	task :all => :environment do
		Migrator.migrate
  end
end