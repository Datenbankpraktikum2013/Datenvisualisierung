require File.expand_path('./lib/migrator.rb')


namespace :migrate do
	desc 'Migrate the whole Database'
 	task :all => [:locations, :students] do
		Migrator.migrate
	desc 'Migrate all Locations'
	task :locations => :environment do
		Migrator.migrateLocations
	desc 'Migrate all Students'
	task :students => :environment do
		Migrator.migrateStudents
  end
end