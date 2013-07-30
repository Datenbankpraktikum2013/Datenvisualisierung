require mysql2

def main
	client = Mysql2::Client.new(:host => "mysql5.serv.uni-osnabrueck",:username => "sosruntime", :password => "soSRuntime", :database => "misdb")

	#Get all studying Students
	students = client.query("SELECT DISTINCT `STG_MATRIKELNR` AS 'MatrNr', `STG_GEBJAHR` AS 'GebJahr', `STG_GESCHLECHT` AS 'Geschlecht', `STG_STAATSANGH` AS 'Staatsangeh'
FROM `FKT_STUDIENGAENGE`")
	#Get study fields for Students
	studentMap = Hash.new
	students.each do |student|
		fieldIDs = client.query("SELECT DISTINCT STG_FACH FROM FKT_STUDIENGAENGE WHERE STG_MATRIKELNR = ${}")
		studentMap[student] = fieldIDs
		studentDB = Student.new
		studentDB.
