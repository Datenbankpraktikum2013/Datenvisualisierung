/* 
 * Fasst alle Funktionalitaeten zusammen die fuer die Anzeige des Column-Charts
 * gebraucht werden.
 */

var App = App || {};

App.chart.columnchart = {
	// Konfigurationsdaten fuer das Balkendiagramm.
	config : {
        chart: {
            type: 'column',
            events: {
                redraw: function(){  // Ladeanzeige muss noch gemacht werden, warten auf dynamische Daten 
                    // this.showLoading();
                    this.hideLoading();
                },
                load: function(){
                    this.hideLoading();
                    // this.showLoading();
                },
                addSeries: function(){
                    this.redraw();
                },
                click : function() {
                    $('.popover').remove();
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
                cursor : 'pointer',
        		point : {
                    events : {
            			click: function(event) {
                            $('.popover').remove();
                            $(event.target).popover({
                              title : '<strong>Diesen Datensatz aufteilen nach:</strong>',
                              html : true,
                              content : '<ul><li>'+this.category+'</li><li>'+this.series.name+'</li></ul>',
                              container : 'body',
                              placement : 'auto right',
                              trigger : 'manual'
                            }).popover('show');
                            console.log('bin hier!');
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
        this.config.categories = App.model.data.categories;
        this.config.series = App.model.data.series;
        $('#chart').highcharts(this.config);
    }

};
