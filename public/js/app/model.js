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