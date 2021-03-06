/* 
 * Kapselt den Zugriff auf die Immatrikulationsdaten und regelt die
 * Kommuninkation mit dem Server.
 */

var App = App || {};

App.model = {
	
	location : 2,

	loaded : 0,

	init : function() {
		radio('filter.submit').subscribe(this.submitListener);
	},
	/** Hoert auf den Submit-Button um die Daten aus fuer das Model aus dem Formular
		zu holen */
	submitListener : function() {
		App.model.fetch();
	},

	checkLoadedAll : function() {
		if (App.model.loaded == 2) {
			App.model.loaded = 0;
			radio('model.fetched').broadcast();
		} else {
			App.model.loaded++;
		}
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
	 * @param {Filter}
	 */
	prepareParameters : function(filter){
		var parameters = {};
		var tmp = '';
		/* gehe jedes Objekt in der View durch und schreibe es in Parameters */
		$.each(filter, function(index, value){
			if ( !( value === null || value === undefined || value === '')) {
				if (value instanceof Array) {
					if ( (index != 'gender' || value.length != 2) 
						&& (index != 'graduation_status' || value.length != 2)) {
						parameters[index] = value.join(', ');
					}

				} else 

				if (index == 'discipline_name2') {
					parameters.discipline_name += ', ' + value;
				}
				else parameters[index] = value;

			} 
		});
		/* stecke das Jahr, dass aus dem Slider ausgelesen wird in prepare Parameters */
		var year = App.slider.getValue();
		var param_year = '';
		if (year !== 'All') {
			if (year % 1 == 0.5) {
				param_year = Math.floor(year)*10 + 1
			} else {
				param_year = Math.floor(year)*10 + 2
			}
			if (filter.graduation_status.indexOf('S') > -1) {
				if (filter.search_category == 'semester_of_matriculation') {
					var years = [];
					for (var i=19950; i < 20130; i += 10) {
						years.push(i+1);
						years.push(i+2);
					}
					parameters.semester_of_matriculation = years.join(', ');
				} else {
					parameters.semester_of_matriculation = param_year;
				} 
			} else {
				parameters.semester_of_deregistration = param_year;
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
	//Limitiert die Serie auf max. 20 Einträge
	limitateSeries : function(data){
		
		if(data.categories.length > 20){

			//get size of each category
            var catSizes = [];
            for(var categoryI = 0; categoryI < data.categories.length; categoryI++){
                var catInfo = {
                    "indexOld": categoryI,
                    "name"    : data.categories[categoryI],
                    "sum"     : 0
                }
                for(var seriesI = 0; seriesI < data.series.length; seriesI++){
                    catInfo.sum += data.series[seriesI].data[categoryI];
                }
                catSizes.push(catInfo);
            }
            //sort those sizes descending
            catSizes.sort(function(a, b){return b.sum - a.sum;});

            //for each series
            for(var seriesI = 0; seriesI < data.series.length; seriesI++){
                var seriesData = [];
                //resort all seriesData by placing them according to catSizes
                for(var catIndex = 0; catIndex < 19; catIndex++){
                    seriesData[catIndex] = data.series[seriesI].data[catSizes[catIndex].indexOld];   
                }
                seriesData[19] = 0;
                //sum up all categories after index 18 and put the sum into index 19
                for(var catIndex = 19; catIndex < catSizes.length; catIndex++){
                    seriesData[19] += data.series[seriesI].data[catSizes[catIndex].indexOld];
                }
                //update series
                data.series[seriesI].data = seriesData;
            }

            //update categories analogue to series
            data.categories = [];
            for(var catIndex = 0; catIndex < 19; catIndex++){
                data.categories[catIndex] = catSizes[catIndex].name;
            }
            data.categories[19] = "Sonstige";
		}
		return data;
	},
	//bearbeitet die Jahre 
	modifyYearSeries : function(data){
		var  newSeries = {
			series : [], 
			categories : []
		}
		for (var i=0; i < data.series.length; i++) {
			newSeries.series.push({name:data.series[i].name, data: []});
		}
		var offset = 1;
		for(var i = 0; i < data.categories.length; i++){ //19981 //19982 //19991 //19992
			if(data.categories[i+1] - data.categories[i] == 9 ){
				newSeries.categories.push(data.categories[i]+' '+ data.categories[i+1]);
				for (var j=0; j < data.series.length; j++) {
					newSeries.series[j].data.push(data.series[j].data[i] + data.series[j].data[i+1]);
				}
				i++;
			} else {
				newSeries.categories.push(data.categories[i]);	
				for (var j=0; j < data.series.length; j++) {
					newSeries.series[j].data.push(data.series[j].data[i]);
				}
			}
		}
		console.log(newSeries);
		return newSeries;
	},

	/*
	 * Laedt einen neuen Datensatz mit den aktuellen Filtern vom Server.
	 */
	fetch : function() {
		radio('model.fetch').broadcast();
		
		this.post(App.filter.getFilter());
		
		var url = 'searches/'+App.model.location+'.json?representation=highcharts&animation=';
		url += (App.chart.render_type === "update");
		var url_gmaps = 'searches/'+App.model.location+'.json?representation=maps';
		var url_globe = 'searches/'+App.model.location+'.json?representation=globe';
	
		$.getJSON(url, function(data) {
			if(App.filter.getFilter().search_category == 'semester_of_matriculation'){
				App.model.data = App.model.modifyYearSeries(data.data);
			}
			else{
				App.model.data = App.model.limitateSeries(data.data);
			}
			radio('model.hc.fetched').broadcast();
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(this.checkLoadedAll);
		
		$.getJSON(url_gmaps, function(data) {
			App.model.data_gmaps = data.data_gmaps;
			radio('model.gmaps.fetched').broadcast();
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(this.checkLoadedAll);

		$.getJSON(url_globe, function(data) {
			App.model.data_globe = data.data_globe;
			radio('model.globe.fetched').broadcast();
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(this.checkLoadedAll);
	}
}; 