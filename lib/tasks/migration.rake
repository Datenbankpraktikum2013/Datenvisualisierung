require File.expand_path('./lib/warehouseMigration/migrator.rb')


namespace :migrate do
	desc 'Rebuilds database and loads all data from warehouse'
	task :whole_database =>[:rebuild,:all] do
	end

	desc 'Rebuilds database and loads data from locations.sql and warehouse'
	task :whole_database_with_sql =>[:rebuild,:all_with_sql] do
	end
	desc 'Rebuilds databse'
	task :rebuild =>["db:drop","db:create","db:migrate"] do
	end

	desc 'Inserts Data from location.sql file into database'
	task :sql => :environment do
		filename = File.expand_path('./db/locations.sql')
		File.open(filename, "r") do |io|
			puts "+++++++++++++++++++++++++++++++++++"
			puts "+Migrating data from locations.sql+"
			puts "+++++++++++++++++++++++++++++++++++"
			count = %x{wc -l #{filename}}.split.first.to_i
			bar = Migrator::LoadingBar.new(count)
			io.lines.each do |line|
				bar.next
				ActiveRecord::Base.connection.execute(line)
			end
			bar.end
			puts "done."
		end
	end

	desc 'Migrates the whole database.'
 	task :all => [:locations, :students, :departments, :teaching_units, :disciplines, :studies] do
	end

	desc 'Migrates locations.sql and the rest'
	task :all_with_sql => [:sql,:students, :departments, :teaching_units, :disciplines, :studies] do
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

  	desc 'Migrate all studies'
  	task :studies => :environment do
  		Migrator.migrateStudies
  	end
end