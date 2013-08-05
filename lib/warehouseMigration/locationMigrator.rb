module Migrator
	#Dumb creation of all not yet existing locations with
	#their countries and federal states if exitend

	#It is not checked wheter information has changed or not!!!
	def self.migrateLocations
		print "\n+++++++++++++++++++++++++\n"
		print "+Now migrating locations+\n"
		print "+++++++++++++++++++++++++\n"

		print "retrieving mapperfile\n"
		nameMapper = Hash.new
		CSV.foreach(File.expand_path(CSV_PATH)) do |row|
			nameMapper[row[0]] = row[2]
		end

		print "retrieving locations\n"

		#Here the whole table is loaded into memory
		#Would be better to do this in batches!
		locQuery = CLIENT.query(
			"SELECT
				HZBO_STADT as 'location_name',
				HZBO_BUNDESLAND as 'federal_state_name',
				HZBO_STAAT as 'country_name',
				HZBO_ID as 'data_warehouse_id'
			FROM DIM_HZBORTE")

		numAll = locQuery.each.length
		print "got #{numAll} locations from datawarehouse\n"
		print "now iterating over them and creating missing ones\n"

		numDone = 0
		numNewLocations = 0
		numNewCountries = 0
		numNewFedStates = 0
		bar = LoadingBar.new(numAll)
		unknownLocations = Array.new

		locQuery.each do |location|
			bar.next

			locationDB = Location.find_by_data_warehouse_id(location["data_warehouse_id"])
			if(locationDB == nil)

				location["country_name"].strip!
				country = Country.find_by_country_name(location["country_name"])

				if(country == nil)
					#If we could not find the country we have to create it
					country = Country.new
					country.country_name = location["country_name"]
					country.save
					numNewCountries += 1
				end

				if(location["federal_state_name"] != nil)
					location["federal_state_name"].strip!
					fedState = FederalState.find_by_federal_state_name(location["federal_state_name"])
					if(fedState == nil)
						#If we could not find the federal state we have to create it
						fedState = FederalState.new
						fedState.federal_state_name = location["federal_state_name"]
						fedState.save
						numNewFedStates += 1
					end
				end

				locationDB = Location.new

				if(location["location_name"]==nil)
					location["location_name"] = "Ausland"
				else
					location["location_name"].slice!(/\(.*/)
					location["location_name"].strip!
					name = location["location_name"]

					if(nameMapper.has_key?(name))
						result = Geocoder.search("#{nameMapper[name]},#{fedState.federal_state_name}").first
					else
						result = Geocoder.search("#{name},#{fedState.federal_state_name}").first
					end
					sleep 0.25
					if(result == nil)
						unknownLocations.insert(-1,[name,fedState.federal_state_name])
					else
						locationDB.longitude = result.longitude
						locationDB.latitude = result.latitude
					end
				end

				locationDB.data_warehouse_id = location["data_warehouse_id"]
				locationDB.location_name = location["location_name"]
				locationDB.federal_state = fedState
				locationDB.country = country

				locationDB.save
				numNewLocations += 1
			end
		end
		bar.end
		length = unknownLocations.length
		if(length>0)
			if(length == 1)
				print "there was one location that could not be found\n"
			else
				print "there were #{length} locations that could not be found\n"
			end
			print "please add the missing information to #{CSV_PATH}\n"

			CSV.open(File.expand_path(CSV_PATH), "wb") do |csv|
				csv.eof
				unknownLocations.each do |value|
					csv << [value[0],value[1],"?"]
				end
			end
		end
		print "done. Created:\n"
		print "#{numNewLocations} new "+"location".pluralize(numNewLocations)
		print "\n#{numNewCountries} new "+"country".pluralize(numNewCountries)
		print "\n#{numNewFedStates} new federal "+"state".pluralize(numNewFedStates)
		print "\n"
	end
end