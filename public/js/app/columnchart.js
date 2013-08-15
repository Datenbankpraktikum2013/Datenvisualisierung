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
                    //this.showLoading();
                   // this.hideLoading();
                },
                load: function(){
                    this.hideLoading();
                    // this.showLoading();
                },
                addSeries: function(){
                    this.redraw();
                },
                click : function() {
                    //$('.popover').remove();
                }
            },
            zoomType: 'xy',
            pinchType: 'xy'
        },
        title: {
            text: "Ihre Suche",
            style: {
                fontWeight: 'bold'
            },
        },
        xAxis: {
            categories: App.model.data.categories,
          //  checkLabels(),
            labels : {
                rotation : -45,
                align : 'right'
            }
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
                text: ''
            }
        },
        tooltip: {
            animation: 'true'
        },
        credits: {
            enabled: false
        },
        plotOptions : {
            column : {
                animation: {
                    duration: 500
                }                
            },
        	series : {
                stacking : 'normal',
                cursor : 'pointer',
        		point : {
                    events : {
            			click: function(event) {
                            App.chart.showDrilldownPopup(this, event);
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
        this.config.xAxis.categories = App.model.data.categories;
        this.config.series = App.model.data.series;
        this.config.title = App.mode.data.title;
        $('#chart').highcharts(this.config);
    },

    update : function() {
        var chart = $('#chart').highcharts();
        var updated = false;
        
        for (var i=0; i < App.model.data.categories.length; i++) {
            updated = false;
            for (var j=0; j < chart.xAxis[0].categories.length; j++) {
                if (App.model.data.categories[i] === chart.xAxis[0].categories[j]) {
                    for (var k=0; k < chart.series.length; k++) {
                        chart.series[k].data[j].update(App.model.data.series[k].data[i], false);
                    }
                    updated = true;
                }
            }
            if ( ! updated) {
                var cat = chart.xAxis[0].categories;
                cat.push(App.model.data.categories[i]);
                chart.xAxis[0].setCategories(cat, false);
                for (var j=0; j < chart.series.length; j++) {
                    chart.series[j].addPoint(App.model.data.series[j].data[i], false);
                }
            }
        }
        chart.redraw();
    }
};
