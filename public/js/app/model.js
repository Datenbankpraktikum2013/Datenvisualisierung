/* 
 * Kapselt den Zugriff auf die Immatrikulationsdaten und regelt die
 * Kommuninkation mit dem Server.
 */

var App = App || {};

App.model = {
	
	location : 2,

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

	prepareParameters : function(filter){
		var parameters = {};
		console.log(filter);
		$.each(filter, function(index, value){
			if (value instanceof Array) {
				if (value.length == 1) {
					parameters[index] = value[0];
				}
			} else if (value != false) {
				parameters[index] = value;
			} 
		});
		console.log(parameters);
		return parameters;
	},

	/* 
	* Fuehrt eine neue Suche aus indem ein POST-Objekt 
	* zur Rails Anwendung geschickt wird
	*/
	post : function(filter) {
		
		var parameters = this.prepareParameters(filter);
		//Macht das Postrequest 
		$.ajax({
			type : "POST", 
			url: "/searches.json" ,
			async : false,
			data : { 
				search : parameters
			},
			success : function(data, textStatus, request){
				var response = request.getResponseHeader('Location');
				var patt = /([0-9]+$)/;
				App.model.location = patt.exec(response)[0];
			}
			
		});
		console.log(filter.Geschlecht);
		return location;
	},

	fetch : function(filter) {
		radio('model.fetch').broadcast();
		App.filter.extendFilter();
		var formstate = App.filter.getFilter();
		this.post(formstate);
		var url = 'searches/'+App.model.location+'.json?representation=highcharts';
		var url_gmaps = 'searches/'+App.model.location+'.json?representation=maps';
	

	


		$.getJSON(url, function(data) {
			App.model.data = data.data;
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function(){
	
		});
	
		$.getJSON(url_gmaps, function(data) {
			App.model.data_gmaps = data.data_gmaps;
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function(){
			radio('model.fetched').broadcast();
		});
	}

		
}; 