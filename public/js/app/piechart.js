var App = App || {};

App.piechart = {
	el : $('#chart'),

	render : function() {
		var dataSet1 = [];
    	var dataSet2 = [];
    	var colors = Highcharts.getOptions().colors;
    	var y=0;
    	var zaehler = [];
    	// 2 For-Schleifen als Hilfe für die Werte im inneren Kreis.
    	// Es wird für jede gegeben Series ein Platz in dem Array Zaehler
    	// angelegt, die entsprechende Stelle wird dann mit den
    	// aufaddierten Werten befüllt.
    	for(var i = 0; i < App.model.data.series.length; i++){
    		zaehler.push(0);
    		for(var j = 0; j < App.model.data.series[i].data.length; j++){
    			zaehler[i] += App.model.data.series[i].data[j]
        		}
    	}
    	// 2 For-Schleifen zum erstellen des inneren und äußeren Kreises.
    	// Für jede Serie wird ein innerer Bereich gesichert und Enstprechend
    	// der Anzahl der Categorien werden die äußeren Ringe befüllt und
    	// den passenden inneren Bereichen zugewiesen.
    	for(var i = 0; i < App.model.data.series.length; i++){
    		dataSet1.push({
    			name: App.model.data.series[i].name,
    			nameFilter: App.model.data.series[i].name,
    			y: zaehler[i],
    			color: colors[i]
    		});
    		for(var j = 0; j < App.model.data.series[i].data.length; j++){
    			var brightness = 0.2 - (j / App.model.data.series[i].data.length) / 5;
    			dataSet2.push({
    				categories: App.model.data.categories[j],
    				name: App.model.data.series[i].name + ' in ' + App.model.data.categories[j],
    				nameFilter: App.model.data.series[i].name,
    				y: App.model.data.series[i].data[j],
    				color: Highcharts.Color(colors[i]).brighten(brightness).get()
    			});
    		}
    	}
    	// Erstellen des Charts
    	// Alle Design einstellen werden hier gesetzt
    	$('#chart').highcharts({
	        chart: {
	            type: 'pie'
	        },
	        title: {
            	text: App.model.data.title
        	},
	        legend:{
	        	enabled: true
	        },
	        xAxis: {
	            categories: App.model.data.categories
	        },
	        yAxis: {
	            title: {
	                text: 'Anzahl'
	            }
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
       	 	credits: {
            	enabled: false
	        },
	        plotOptions : {
	        	pie: {
	        		shadow: false,
	        		center: ['50%','50%'],
	        		showInLegend: true,

	        	},
	        	series: {
	        		point: {
	        			events: {
	        				click : function(){
	        					// Durch klicken werden links die Filter passend
	        					// zu dem angeklickten Bereich gesetzt
	        					App.filter.setDrillDownFilter({
	        						category: this.categories,
	        						filter: this.nameFilter

	        					});
	        				}
	        			}
	        		}
	        	}
	        },
	        tooltip: {
	        	style: {
					fontSize: '11px',
					padding: '8px'
				},
				animation: true
	        },
	        // einlesen der oben erstellen Datensätze zum zeichnen der
	        // Torte
	        series : [{
	        	name: dataSet1.categories,
	        	data: dataSet1,
	        	size: '60%',
	        	dataLabels: {
	        			distance: -70,
	        			color: 'white'
	        		}
	        },{
	        	name: dataSet1.categories,
	        	data: dataSet2,
	        	size: '90%',
	        	innerSize: '65%'
	        }]
    	});
    }

};