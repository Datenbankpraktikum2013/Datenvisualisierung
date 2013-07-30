/* 
 * Fasst alle Funktionalitaeten zusammen die fuer die Anzeige des Column-Charts
 * gebraucht werden.
 */

var App = App || {};

App.columnchart = {
	// Konfigurationsdaten fuer das Balkendiagramm.
	config : {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: App.model.data.categories
        },
        yAxis: {
            title: {
                text: 'Anzahl'
            }
        },
        plotOptions : {
        	series : {
        		stacking : 'normal',
        		point : {
        			events : {
	        			click : function() {
        					App.filter.setDrillDownFilter({
    							category : this.category, 
    							filter : this.series.name
    						});
	        			}
        			}
        		}
        	}
        },
        series : App.model.data.series
	},

	// Rendert das Balkendiagramm in div#chart
	render : function() {
    	$('#chart').highcharts(this.config);
    }

};