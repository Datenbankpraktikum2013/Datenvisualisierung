require mysql2

def main
	client = Mysql2::Client.new(:host => "mysql5.serv.uni-osnabrueck",:username => "sosruntime", :password => "soSRuntime", :database => "misdb")

	#Get all studying Students
	students = client.query("SELECT DISTINCT `STG_MATRIKELNR` AS 'matrNr', `STG_GEBJAHR` AS 'gebJahr', `STG_GESCHLECHT` AS 'geschlecht', `STG_STAATSANGH` AS 'herkStaat'
FROM `FKT_STUDIENGAENGE`")
	#Get study fields for Students
	studentMap = Hash.new
	students.each do |student|
		fieldIDs = client.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE ")