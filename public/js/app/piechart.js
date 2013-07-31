var App = App || {};

App.piechart = {
	el : $('#chart'),

	render : function() {
		var dataSet1 = [];
    	var dataSet2 = [];
    	var colors = Highcharts.getOptions().colors;

    	for(var i = 0; i < App.model.data.categories.length; i++){
    		dataSet1.push({
    			name: App.model.data.series[i].name,
    			nameFilter: App.model.data.series[i].name,
    			y: App.model.data.series[i].data[0]+App.model.data.series[i].data[1],
    			color: colors[i]
    		});

    		for(var j = 0; j < App.model.data.series[i].data.length; j++){
    			var brightness = 0.2 - (j / App.model.data.series[i].data.length) / 5;
    			dataSet2.push({
    				categories: App.model.data.categories[j],
    				name: App.model.data.series[i].name + ' in ' + App.model.data.categories[j],
    				nameFilter: App.model.data.series[i].name,
    				y: App.model.data.series[j].data[j],
    				color: Highcharts.Color(colors[i]).brighten(brightness).get()
    			});
    		}
    	}
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
	        					App.filter.setDrillDownFilter({
	        						category: this.categories,
	        						filter: this.nameFilter

	        					});
	        					console.log(this)
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
	        series : [{
	        	name: dataSet1.categories,
	        	data: dataSet1,
	        	size: '60%',
	        	dataLabels: {
	        			distance: -90,
	        			color: 'white'
	        		}
	        	// dataLabels: {
	        	// 	formatter: function() {
	        	// 		return this.y > 1 ? this.point.name : null;
	        	// 	},
	        	// }
	        },{
	        	name: dataSet1.categories,
	        	data: dataSet2,
	        	size: '90%',
	        	innerSize: '65%'
	        	// dataLabels: {
	        	// 	formatter: function(){
	        	// 		return this.y > 1 ? '<b>' + this.point.name + ':</b> '+ this.y +'%'  : null;
	        	// 	}
	        	// }
	        }]
    	});
    }

};