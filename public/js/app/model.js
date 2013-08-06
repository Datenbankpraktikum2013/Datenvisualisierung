/* 
 * Kapselt den Zugriff auf die Immatrikulationsdaten und regelt die
 * Kommuninkation mit dem Server.
 */

var App = App || {};

App.model = {

	init : function() {
		radio('filter.submit').subscribe(this.submitListener);
	},
	
	submitListener : function() {
		App.model.fetch(App.filter.getFilter());
	},

	// Enthaelt immer den aktuellen Datensatz
	data : {
		categories : ['Deutschland','Schweiz','Österreich'],
		title : 'Test der Laender',
		series : 
		[{
            name: 'Maenner',
            data: [2600, 2100]
            
        },{
        	name: 'Frauen',
        	data: [2600]
        },{
        	name: 'Kinder',
        	data: [900, 600, 800]
        }]
	},
	/*
	 * einfügen der Daten für gMaps 
	 */

	data_gmaps: [{ 
		country_iso_code : 'DE',
  		longitude : 10,
  		latitude : 50,
  		number : 2000,
		federal_states : [{
    		federal_states_iso_code : 'NDS',
  			longitude : 9.732,
    		latitude : 52.375,
    		number : 1000,
    		cities : [{
      			location_name : 'Osnabrück',
      			longitude : 8.0471,
      			latitude : 52.2799,
      			number : 100
      			},{
      			location_name: 'Melle',
      			longitude : 8.33726,
      			latitude: 52.203,
      			number: 15
      			}]
  		}]

	},{
		country_iso_code: 'IT',
		longitude : 12.48,
  		latitude : 41.89,
  		number : 15
	}],

	/*
	 * Holt einen neuen Datensatz mit den uebergebenen Filtern aus
	 * der Datenbank
	 */
	fetch : function(filter) {
		radio('model.fetch').broadcast();
		App.filter.extendFilter();
		$.getJSON('searches/1.json?representation=highcharts', function(data) {
			App.model.data = data.data;
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function(){
			radio('model.fetched').broadcast();
		});
		console.log(this.data);
		return this.data;
	},

	/* 
	 * Fuehrt eine neue Suche aus indem ein POST-Objekt 
	 * zur Rails Anwendung geschickt wird
	 */
	
	post : function(filter) {
		//Testweise
		$.post('searches/student.html', function(data){
			var string = 'ein lustiger String';
		})}


}; 