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
		unknownCountries = Array.new

		locQuery.each do |location|
			bar.next

			locationDB = Location.find_by_data_warehouse_id(location["data_warehouse_id"])
			if(locationDB == nil)

				location["country_name"].strip!
				if(nameMapper.has_key?(location["country_name"]))
					location["country_name"] = nameMapper[location["country_name"]]
				end

				
				country = Country.find_by_country_name(location["country_name"])
				if(country = nil)
					country = createCountry(location["country_name"])
					if(country == nil)
						unless unknownCountries.include?(location["country_name"])
							unknownCountries << location["country_name"]
						end
						#we cannot create location without country
						next
					else
						numNewCountries += 1
					end
				end

				if(location["federal_state_name"] != nil)
					location["federal_state_name"].strip!
					fedState = FederalState.find_by_federal_state_name(location["federal_state_name"])
					if(fedState == nil)
						fedState = createFederalState(location["federal_state_name"])
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
						#If the information has not yet been added there is still a ? as value.
						#In this case there is obviously no sense in using it for the query.
						if(nameMapper[name] != "?")
							result = Geocoder.search("#{nameMapper[name]},#{fedState.federal_state_name}").first
						else
							result = nil
						end
					else
						result = Geocoder.search("#{name},#{fedState.federal_state_name}").first
					end
					sleep 0.25
					if(result == nil)
						unless(unknownLocations.include?([name,fedState.federal_state_name]))
							unknownLocations << [name,fedState.federal_state_name]
						end
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
		
		lLength = unknownLocations.length
		cLength = unknownCountries.length
		if((lLength + cLength) > 0)
			if(lLength == 1)
				print "there was one location"
			else
				print "there were #{lLength} locations"
			end
			print " and #{cLength} #{"country".pluralize(cLength)} that could not be found\n"
			print "please add the missing information to #{CSV_PATH}\n"

			CSV.open(File.expand_path(CSV_PATH), "ab") do |csv|
				unknownLocations.each do |value|
					unless(nameMapper.has_key?(value[0]))
						csv << [value[0],value[1],"?"]
					end
				end
				unknownCountries.each do |value|
					unless(nameMapper.has_key?(value))
						csv << [value,"-","?"]
					end
				end
			end
		end
		print "done. Created:\n"
		print "#{numNewLocations} new "+"location".pluralize(numNewLocations)
		print "\n#{numNewCountries} new "+"country".pluralize(numNewCountries)
		print "\n#{numNewFedStates} new federal "+"state".pluralize(numNewFedStates)
		print "\n"
	end

	def self.createCountry(country_name)
		attributes = findCountryAttributes(country_name)
		if(attributes = nil)
			return nil
		end
		country = Country.new(attributes)
		country.save
		return country
	end
	def self.findCountryAttributes(country_name)
		attibutes = {country_name:"unklar",country_iso_code:"",longitude:0.0,latitude:0.0}
		if(country_name == "?")
			return nil
		end
		if(country_name == "!")
			return attributes
		end
		if(/!.+/ === country_name)
			attributes[:country_name] = country_name[1..-1]
		end
		if(/(ü|Ü)briges (.+)/ === country_name)
			country_name.slice!(/(ü|Ü)briges /)
			attributes[:country_name] = country_name
			gc = Geocoder.search(country_name)
			sleep 0.25
			if(gc = nil)
				return nil
			end
			attributes[:longitude] = gc.longitude
			attributes[:latitude] = gc.latitude
			attributes[:country_iso_code] = gc.address_components.first["short_name"]
		end
		return attributes
	end

	def self.createFederalState(federal_state_name)
		#If we could not find the federal state we have to create it
		fedState = FederalState.new
		fedState.federal_state_name = location["federal_state_name"]
		fedStateGC = Geocoder.search(fedState.federal_state_name).first
		sleep 0.25
		if(fedStateGC == nil)
			raise "Cannot find federal state #{fedState.federal_state_name}!\nTell secretary to change DIM_HZBORTE entry with HZBO_ID #{location["data_warehouse_id"]} or blame Google."
		end
		fedState.longitude = fedStateGC.longitude
		fedState.latitude = fedStateGC.latitude

		#Unfortunately the short_names for the city-states are their actual name.
		#Therefore we have to overwrite them manually.
		cityStates = {"Berlin" => "BE", "Hamburg" => "HH", "Bremen" => "HB" }
		if(cityStates.has_key?(fedState.federal_state_name))
			fedState.federal_state_iso_code = cityStates[fedState.federal_state_name]
		else
			fedState.federal_state_iso_code = fedStateGC.address_components.first["short_name"]
		end
		fedState.save
		return fedState
	end
end