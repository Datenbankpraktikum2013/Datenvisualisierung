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
		App.model.fetch();
	},

	/*
	 * Enthaelt immer den aktuellen Datensatz fuer Highcharts 
	 */
	data : {},

	/*
	 * Enthaelt immer den aktuellen Datensatz fuer GoogleMaps
	 */
	data_gmaps : [],

	/*
	 * Enthaelt immer den aktuellen Datensatz fuer GoogleGlobe
	 */

	data_globe : [],
	/*
	 * Bereitet die Filter aus dem Formular fuer das Erstellen des 
	 * Suchobjektes auf.
	 */
	prepareParameters : function(filter){
		var parameters = {};
		$.each(filter, function(index, value){
			if ( !( value === null || value === undefined || value === '')) {
				if (value instanceof Array) {
					if (index != 'gender') {
						parameters[index] = value.join(', ');
					}
				} else {
					parameters[index] = value;
				}
			} 
		});

		var year = App.slider.getValue();
		if (year !== 'All') {
			if (year % 1 == 0.5) {
				parameters.semester_of_matriculation = Math.floor(year)*10 + 1
			} else {
				parameters.semester_of_matriculation = Math.floor(year)*10 + 2
			}
		}
		return parameters;
	},

	/* 
	* Fuehrt eine neue Suche aus indem ein POST-Request 
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
	},

	checkLabels : function(series){

	},

	/*
	 * Laedt einen neuen Datensatz mit den aktuellen Filtern vom Server.
	 */
	fetch : function() {
		radio('model.fetch').broadcast();
		
		this.post(App.filter.getFilter());
		
		var url = 'searches/'+App.model.location+'.json?representation=highcharts';
		var url_gmaps = 'searches/'+App.model.location+'.json?representation=maps';
		var url_globe = 'searches/'+App.model.location+'.json?representation=globe';
	
		$.getJSON(url, function(data) {
			App.model.data = data.data;
			radio('model.hc.fetched').broadcast();
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		});
	
		$.getJSON(url_gmaps, function(data) {
			App.model.data_gmaps = data.data_gmaps;
			radio('model.gmaps.fetched').broadcast();
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function() {
			radio('model.fetched').broadcast();
		});

		$.getJSON(url_globe, function(data) {
			App.model.data_globe = data.data;
			radio('model.globe.fetched').broadcast();
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function() {
			radio('model.fetched').broadcast();
		});
	}
}; 