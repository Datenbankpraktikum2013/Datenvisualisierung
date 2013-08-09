require File.expand_path("lib/warehouseMigration/studentMigrator.rb")
require File.expand_path("lib/warehouseMigration/locationMigrator.rb")
require File.expand_path("lib/warehouseMigration/departmentMigrator.rb")
require File.expand_path("lib/warehouseMigration/teachingUnitMigrator.rb")
require File.expand_path("lib/warehouseMigration/disciplineMigrator.rb")
require File.expand_path("lib/warehouseMigration/studyMigrator.rb")
require File.expand_path("lib/warehouseMigration/credentials.rb")

module Migrator

	BATCHSIZE = 10000

	CSV_PATH = "db/warehouseRealWorldMapping.csv"

	#This query retrieves the last entry for each students study field.
	#STG_STGNR,
	#STG_FACH,
	#STG_LE,
	QUERY_LAST_FIELD_INFO = 
		"FKT_STUDIENGAENGE
		JOIN (
			SELECT
				STG_MATRIKELNR AS MATNR,
				STG_FACHNR AS FACH,
				STG_STGNR AS STUDIENGANG,
				MAX(STG_SEMESTER) AS LETZTEINTRAG
			FROM
				FKT_STUDIENGAENGE
			GROUP BY
				STG_MATRIKELNR,
				STG_FACHNR,
				STG_STGNR
		)AS BLA
		ON
			STG_MATRIKELNR = MATNR AND
			STG_FACHNR = FACH AND
			STG_STGNR = STUDIENGANG AND
			STG_SEMESTER = LETZTEINTRAG
		JOIN
			DIM_ABSCHLUESSE
		ON
			ABINT_ID = STG_ABSCHLUSS"

	#This query retrieves the latest and therfore the most recent entry given for each student
	QUERY_LAST_STUDENT_INFO = 
		"(
			SELECT
				STG_MATRIKELNR,
				STG_SEMESTER,
				STG_GESCHLECHT,
				STG_HZBORT,
				STG_GEBJAHR,
				STG_STAATSANGH
			FROM
				FKT_STUDIENGAENGE
			JOIN (
				SELECT
					STG_MATRIKELNR AS X,
					MAX(STG_SEMESTER) AS Y
				FROM
					FKT_STUDIENGAENGE
				GROUP BY
					STG_MATRIKELNR
				)AS BLA
			ON 
				STG_MATRIKELNR = X AND
				STG_SEMESTER = Y
			GROUP BY
				STG_MATRIKELNR
		UNION
			SELECT
				LAB_MTKNR AS STG_MATRIKELNR,
				LAB_PSEM AS STG_SEMESTER,
				LAB_GESCHLECHT AS STG_GESCHLECHT,
				LAB_HZBORT AS STG_HZBORT,
				YEAR(LAB_GEBDAT) AS STG_GEBJAHR,
				LAB_STAATSANGH AS STG_STAATSANGH
			FROM
				FKT_LAB
			JOIN (
				SELECT
					LAB_MTKNR AS X,
					MAX(LAB_PSEM) AS Y
				FROM
					FKT_LAB
				GROUP BY
					LAB_MTKNR
				)AS BLUBB
			ON 
				LAB_MTKNR = X AND
				LAB_PSEM = Y
			GROUP BY
				STG_MATRIKELNR
		)AS UNI"

	
	
	class LoadingBar

		def initialize(datasize = 100, barLength = 25, barsign="*")
			if(barLength <= 0)
				raise "BarLength may not be smaller than 1!"
			end
			if(datasize <= 0)
				datasize = 1
			end
			@stepSize = (barLength*1.0)/datasize

			@barsign = barsign
			@barLength = barLength
			@printedSigns = 0.0
			@nextCount = 0
			@datasize = datasize
			@ended = false

			if(barLength>10)
				barString = " "*((barLength+1)/2 - 4)
				barString += "50%"
				if(barLength%2 == 0)
					barString += "\\/"
				else
					barString += "V"
				end
				barString += " "*((barLength/2) - 6 + (barLength%2))
			elsif(barLength>4)
				barString = " "*(barLength-5)
			end

			if(barLength>4)
				barString += "100%V"
			elsif(barLength>0)
				barString = " "*(barLength-1)
				barString += "V"
			end

			print "\n"
			print barString
			print "\n"
		end

		def next

			if(@nextCount > @datasize)
				return false
			else
				newlength = @nextCount*@stepSize
				lengthDif = newlength - @printedSigns
				if(lengthDif >= 1)
					print @barsign*lengthDif
					@printedSigns += lengthDif
					@printedSigns -= lengthDif%1
				end
				
			end
			if(@nextCount == @datasize)
				self.end
				return false
			end
			@nextCount += 1
			return true
		end

		def end
			unless @ended
				print @barsign*(@barLength-@printedSigns)
				print "\n"
				@ended = true
			end
		end
	end
end