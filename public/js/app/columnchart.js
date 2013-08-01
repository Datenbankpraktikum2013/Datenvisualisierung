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
                redraw: function(){  // Ladeanzeige muss noch gemacht werden, warten auf dynamische Daten 
                    // this.showLoading();
                    this.hideLoading();
                    console.log('reloading')
                },
                load: function(){
                    this.hideLoading();
                    // this.showLoading();
                    console.log('loaded')
                },
                addSeries: function(){
                    this.redraw();
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
        // Wenn nur eine Series dann blende Legende aus
        this.config.legend.enabled = (App.model.data.series.length != 1);
        $('#chart').highcharts(this.config);
    }

};
