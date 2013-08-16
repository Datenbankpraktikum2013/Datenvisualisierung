var App = App || {};

App.chart.piechart = {

	render : function() {
		var dataSet1 = [];
    	var dataSet2 = [];
    	var colors = Highcharts.getOptions().colors;
    	var y=0;
    	var zaehler = [];
    	
    	//Aufsummieren der Kategorien um ein einfaches Piechart zu zeichnen
    	if(App.model.data.categories.length > 10 || App.model.data.series.length > 20){
	    	var summe = 0;
	    	var newSeries = {data: {
	    						categories:[],
	    						series:[{
	    							name : 'Summe',
	    							data : []
	    							}]
	    						}
	    					}
	    	var array = [];
	    	
	    	for(var i = 0; i < App.model.data.categories.length; i++){
	    		for(var j = 0; j < App.model.data.series.length; j++){
	    			summe += App.model.data.series[j].data[i];
	    		}
	    		array.push(App.model.data.categories[i]);
	    		array.push(summe);
	    		newSeries.data.series[0].data.push(array);
	    		array = [];
	    		summe = 0;
	    		newSeries.data.categories.push (App.model.data.categories[i]);
	    	}
	    	console.log(newSeries);



	    	// Erstellen des Charts
	    	// Alle Design einstellen werden hier gesetzt
	    	$('#chart').highcharts({
		        chart: {
		            type: 'pie'
		        },
		        title: {
	            	text: App.model.data.title,
	            	style: {
		                fontWeight: 'bold'
		            }
	        	},
		        legend:{
		        	enabled: true
		        },
		        xAxis: {
		            categories: newSeries.data.categories
		        },
		        yAxis: {
		            title: {
		                text: 'Anzahl'
		            },
		            categories: newSeries.data.categories
		        },
		        legend : { 
		            navigation: {
		                animation: 'true'
		            	},
		       	 	credits: {
		            	enabled: false
			        }
			       },
		        plotOptions : {
		        	pie: {
		        		shadow: false,
		        		center: ['50%','50%'],
		        		showInLegend: true,
		        		allowPointSelect: true

		        	},
		        	series: {
		        		point: {
		        			events: {
		        				click : function(event){
		        					App.chart.showDrilldownPopup(this, event);
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
		        
		        series : newSeries.data.series
	    	});
	    }
	    else{

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
	    			if(App.model.data.series[i].data[j] == 0){

	    			}
	    			else{
		    			var brightness = 0.2 - (j / App.model.data.series[i].data.length) / 5;
		    			dataSet2.push({
		    				categories: App.model.data.categories[j],
		    				name: App.model.data.series[i].name +" " + App.model.data.categories[j],
		    				nameFilter: App.model.data.series[i].name,
		    				y: App.model.data.series[i].data[j],
		    				color: Highcharts.Color(colors[i]).brighten(brightness).get()
		    			});
		    		}
	    		}
	    	}
	    	// Erstellen des Charts
	    	// Alle Design einstellen werden hier gesetzt
	    	$('#chart').highcharts({
		        chart: {
		            type: 'pie'
		        },
		        title: {
	            	text: App.model.data.title,
	            	style: {
		                fontWeight: 'bold'
		            }
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
		        				click : function(event){
		        					//App.chart.showDrilldownPopup(this, event);
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
		        			distance: -10,
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
	}
};