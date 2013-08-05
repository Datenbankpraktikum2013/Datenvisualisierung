require File.expand_path('./lib/migrator.rb')


namespace :migrate do
	desc 'Migrates the whole database.'
 	task :all => [:locations, :students, :departments, :teaching_units, :disciplines] do
	end

	desc 'Migrates all locations. This also migrates countries and federal states.'
	task :locations => :environment do
		Migrator.migrateLocations
	end
	
	desc 'Migrate all students'
	task :students => :environment do
		Migrator.migrateStudents
  	end

	desc 'Migrate all departments'
	task :departments => :environment do
		Migrator.migrateDepartments
  	end

  	desc 'Migrate all teaching units'
	task :teaching_units => :environment do
		Migrator.migrateTeachingUnits
  	end
  	
  	desc 'Migrate all disciplines'
	task :disciplines => :environment do
		Migrator.migrateDisciplines
  	end
end