/* 
 * Fasst alle Funktionalitaeten zusammen die fuer die Anzeige des Column-Charts
 * gebraucht werden.
 */

var App = App || {};

App.columnchart = {
	// Konfigurationsdaten fuer das Balkendiagramm.
	config : {
        chart: {
            type: 'column',
            events: {
                redraw: function(){
                    this.showLoading();
                    console.log('reloading')
                },
                load: function(){
                    this.hideLoading();
                    console.log('loaded')
                }
            },
            zoomType: 'xy',
            pinchType: 'xy'
        },
        title: {
            text: App.model.data.title,
            style: {
                fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: App.model.data.categories
        },
        yAxis: {
            title: {
                text: 'Anzahl'
            }
        },
        loading: {
              hideDuration: 1000,
              showDuration: 1000  
            },
        legend : {
            navigation: {
                animation: 'true'
            },
            title: {
                style:{ 
                    fontWeight: 'bold',
                },
                text: 'Legende'
            }
        },
        tooltip: {
            animation: 'true'
        },
        credits: {
            enabled: false
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
                            console.log(this)
	        			}
        			}
        		},
                
        	}
        },
        series : App.model.data.series
	},

	// Rendert das Balkendiagramm in div#chart
	render : function() {
    	$('#chart').highcharts(this.config);
    }

};
