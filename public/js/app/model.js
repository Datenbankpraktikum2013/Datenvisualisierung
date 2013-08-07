/* 
 * Kapselt den Zugriff auf die Immatrikulationsdaten und regelt die
 * Kommuninkation mit dem Server.
 */

var App = App || {};
var inc = 1;

App.model = {

	init : function() {
		radio('filter.submit').subscribe(this.submitListener);
	},
	
	submitListener : function() {
		App.model.fetch(App.filter.getFilter());
	},

	//Enthaelt immer den aktuellen Datensatz
	data : {
		categories : [],
		title : '',
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

	"data_gmaps":[],

	/*
	 * Holt einen neuen Datensatz mit den uebergebenen Filtern aus
	 * der Datenbank
	 */

	/*
		TODO: Post Objekt zusammenbauen 
			  Post Objekt mit URL suchen
	*/
	/* 
	* Fuehrt eine neue Suche aus indem ein POST-Objekt 
	* zur Rails Anwendung geschickt wird
	*/
	post : function(filter) {
		//Testweise
		$.post("/searches",{ search : {
			gender : filter.Geschlecht , nationality: filter.Heimatland, minimum_age: filter.altervon, maximum_age: filter.alterbis, search_category: filter.groupby, search_series: filter.stackby
		}});
		inc = inc + 1;
		//$.get('searches/');
	},

	fetch : function(filter) {
		radio('model.fetch').broadcast();
		App.filter.extendFilter();
		var url = 'searches/9.json?representation=highcharts';
		var url_gmaps = 'searches/9.json?representation=maps';
		var formstate = App.filter.getFilter();

		//this.post(formstate);


		$.getJSON(url, function(data) {
			App.model.data = data.data;
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function(){
			// radio('model.fetched').broadcast();
		});
		//console.log(this.data);
		//return this.data;
		$.getJSON(url_gmaps, function(data) {
			App.model.data_gmaps = data.data_gmaps;
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function(){
			radio('model.fetched').broadcast();	//@ToDo muss noch gefangen werden
		});
	}

		
}; 