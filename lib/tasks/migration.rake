require File.expand_path('./lib/migrator.rb')


namespace :migrate do
	desc 'Migrates the whole database.'
 	task :all => [:locations, :students] do
		Migrator.migrate
	end
	desc 'Migrates all locations. This also migrates countries and federal states.'
	task :locations => :environment do
		Migrator.migrateLocations
	end
	desc 'Migrate all students'
	task :students => :environment do
		Migrator.migrateStudents
  	end
end