module Migrator

	BATCHSIZE = 10000

	CSV_PATH = "db/warehouseRealWorldMapping.csv"

	DEGREE_MAPPER = {
		1=>"Bachelor",33=>"Bachelor",47=>"Bachelor",82=>"Bachelor",
		94=>"Zertifikat",
		97=>"Kein Abschluss",
		8=>"Referendarexamen",
		30=>"Master",58=>"Master",64=>"Master",66=>"Master",88=>"Master",99=>"Master",
		21=>"Lehramt",22=>"Lehramt",23=>"Lehramt",25=>"Lehramt",27=>"Lehramt",40=>"Lehramt",
		2=>"Promotion",6=>"Promotion",
		11=>"Diplom"}

	CLIENT = Mysql2::Client.new(
		:host => Rails.configuration.database_configuration["warehouse"]["host"],
		:username => Rails.configuration.database_configuration["warehouse"]["username"],
		:password => Rails.configuration.database_configuration["warehouse"]["password"],
		:database => Rails.configuration.database_configuration["warehouse"]["database"])

	def self.buildStudentTable
		CLIENT.query("CREATE TEMPORARY TABLE QUERY_LAST_STG_INFO ENGINE=MYISAM
			SELECT *
			FROM		
			FKT_STUDIENGAENGE
				JOIN (
					SELECT
						STG_MATRIKELNR AS MATNR,
						MAX(STG_SEMESTER) AS LETZTSEMESTER
					FROM
						FKT_STUDIENGAENGE
					GROUP BY
						STG_MATRIKELNR
				)AS RECENT_STG
				ON 
					STG_MATRIKELNR = MATNR AND
					STG_SEMESTER = LETZTSEMESTER")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_LAST_LAB_INFO ENGINE=MYISAM
			SELECT * FROM 
				FKT_LAB
			JOIN (
				SELECT
					LAB_MTKNR AS MATNR,
					MAX(LAB_PSEM) AS LETZTSEMESTER
				FROM
					FKT_LAB
				GROUP BY
					LAB_MTKNR
				)AS RECENT_LAB
			ON 
				LAB_MTKNR = MATNR AND
				LAB_PSEM = LETZTSEMESTER")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_LAST_INFO_UNION ENGINE=MYISAM
			SELECT * FROM(
				SELECT
					STG_MATRIKELNR,
					STG_SEMESTER,
					STG_GESCHLECHT,
					STG_HZBORT,
					STG_GEBJAHR,
					STG_STAATSANGH
				FROM
					QUERY_LAST_STG_INFO
			UNION
				SELECT
					LAB_MTKNR AS STG_MATRIKELNR,
					LAB_PSEM AS STG_SEMESTER,
					LAB_GESCHLECHT AS STG_GESCHLECHT,
					LAB_HZBORT AS STG_HZBORT,
					YEAR(LAB_GEBDAT) AS STG_GEBJAHR,
					LAB_STAATSANGH AS STG_STAATSANGH
				FROM
					QUERY_LAST_LAB_INFO) AS TEMP1
			ORDER BY
				STG_MATRIKELNR ASC")

		CLIENT.query("CREATE INDEX JOIN_INDEX ON QUERY_LAST_INFO_UNION (STG_MATRIKELNR,STG_SEMESTER)")

		CLIENT.query("DROP TEMPORARY TABLE QUERY_LAST_STG_INFO")
		CLIENT.query("DROP TEMPORARY TABLE QUERY_LAST_LAB_INFO")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_LAST_INFO_UNION_RECENT ENGINE=MYISAM
			SELECT
				STG_MATRIKELNR AS MATNR,
				MAX(STG_SEMESTER) AS LETZTSEMESTER
			FROM
				QUERY_LAST_INFO_UNION
			GROUP BY
				STG_MATRIKELNR")

		CLIENT.query("CREATE INDEX JOIN_INDEX2 ON QUERY_LAST_INFO_UNION_RECENT (MATNR,LETZTSEMESTER)")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_LAST_STUDENT_INFO ENGINE=MYISAM
			SELECT *
			FROM
				QUERY_LAST_INFO_UNION
			JOIN
				QUERY_LAST_INFO_UNION_RECENT
			ON
				STG_MATRIKELNR = MATNR AND
				STG_SEMESTER = LETZTSEMESTER
			GROUP BY 
				STG_MATRIKELNR
			ORDER BY
				STG_MATRIKELNR ASC")

		CLIENT.query("DROP TEMPORARY TABLE QUERY_LAST_INFO_UNION")
		CLIENT.query("DROP TEMPORARY TABLE QUERY_LAST_INFO_UNION_RECENT")
	end

	def self.dropStudentTable
		CLIENT.query("DROP TEMPORARY TABLE QUERY_LAST_STUDENT_INFO")
	end

	def self.buildStudyTable
		CLIENT.query("CREATE TEMPORARY TABLE QUERY_RECENT_STG_FIELDS ENGINE=MYISAM
			SELECT *
			FROM
				FKT_STUDIENGAENGE
			JOIN (
				SELECT
					STG_MATRIKELNR AS MATNR,
					STG_STGNR AS STUDIENGANG,
					MAX(STG_SEMESTER) AS LETZTEINTRAG
				FROM
					FKT_STUDIENGAENGE
				GROUP BY
					STG_MATRIKELNR,
					STG_STGNR
			)AS RECENT_STG
			ON
				STG_MATRIKELNR = MATNR AND
				STG_STGNR = STUDIENGANG AND
				STG_SEMESTER = LETZTEINTRAG")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_RECENT_LAB_FIELDS ENGINE=MYISAM
				SELECT *
					FROM FKT_LAB
				JOIN (
					SELECT
						LAB_MTKNR AS MATNR,
						LAB_STGNR AS STUDIENGANG,
						MAX(LAB_PSEM) AS LETZTSEMESTER,
						MAX(LAB_PDATUM) AS LETZTEINTRAG,
						MIN(LAB_PSEM) AS LAB_IMMATSEM
					FROM
						FKT_LAB
					GROUP BY
						LAB_MTKNR,
						LAB_STGNR
					) AS RECENT_LAB
				ON
					LAB_MTKNR = MATNR AND
					LAB_STGNR = STUDIENGANG AND
					LAB_PSEM = LETZTSEMESTER AND
					LAB_PDATUM = LETZTEINTRAG")

		CLIENT.query("CREATE TEMPORARY TABLE	QUERY_RECENT_FIELDS_UNION ENGINE=MYISAM
			SELECT
				STG_MATRIKELNR,
				STG_STGNR,
				STG_FACH,
				STG_LE,
				STG_ABSCHLUSS,
				STG_IMMATSEM,
				STG_SEMESTER
			FROM
				QUERY_RECENT_STG_FIELDS
			UNION
			SELECT
				LAB_MTKNR AS STG_MATRIKELNR,
				LAB_STGNR AS STG_STGNR,
				LAB_STG AS STG_FACH,
				LAB_LE AS STG_LE,
				LAB_ABSCHL AS STG_ABSCHLUSS,
				LAB_IMMATSEM AS STG_IMMATSEM,
				LAB_PSEM AS STG_SEMESTER
			FROM
				QUERY_RECENT_LAB_FIELDS
			ORDER BY
				STG_MATRIKELNR ASC")

		CLIENT.query("CREATE INDEX JOIN_INDEX ON QUERY_RECENT_FIELDS_UNION (STG_MATRIKELNR,STG_STGNR,STG_FACH,STG_SEMESTER)")
		CLIENT.query("DROP TEMPORARY TABLE QUERY_RECENT_LAB_FIELDS")
		CLIENT.query("DROP TEMPORARY TABLE QUERY_RECENT_STG_FIELDS")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_RECENT_FIELDS_UNION_RECENT AS
			SELECT
					STG_MATRIKELNR AS MATNR,
					STG_STGNR AS STUDIENGANG,
					STG_FACH AS STUDIENFACH,
					MAX(STG_SEMESTER) AS LETZTSEMESTER,
					MIN(STG_IMMATSEM) AS IMMATSEM
				FROM
					QUERY_RECENT_FIELDS_UNION AS TEMP1
				GROUP BY
					STG_MATRIKELNR,
					STG_STGNR,
					STG_FACH")

		CLIENT.query("CREATE INDEX JOIN_INDEX2 ON QUERY_RECENT_FIELDS_UNION_RECENT (MATNR,STUDIENGANG,STUDIENFACH,LETZTSEMESTER)")

		CLIENT.query("CREATE TEMPORARY TABLE QUERY_LAST_FIELD_INFO ENGINE=MYISAM
			SELECT *
				FROM
					QUERY_RECENT_FIELDS_UNION
				JOIN
					QUERY_RECENT_FIELDS_UNION_RECENT
				ON
					STG_MATRIKELNR = MATNR AND
					STG_STGNR = STUDIENGANG AND
					STG_FACH = STUDIENFACH AND
					STG_SEMESTER = LETZTSEMESTER
				JOIN
					DIM_ABSCHLUESSE
				ON
					ABINT_ID = STG_ABSCHLUSS
				GROUP BY
					STG_MATRIKELNR,
					STG_STGNR,
					STG_FACH
				ORDER BY
					STG_MATRIKELNR ASC")

		CLIENT.query("DROP TEMPORARY TABLE QUERY_RECENT_FIELDS_UNION_RECENT")
		CLIENT.query("DROP TEMPORARY TABLE QUERY_RECENT_FIELDS_UNION")
	end
	def self.dropStudyTable
		CLIENT.query("DROP TEMPORARY TABLE QUERY_LAST_FIELD_INFO")
	end
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