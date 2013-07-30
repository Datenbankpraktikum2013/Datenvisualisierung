var App = App || {};

App.piechart = {
	el : $('#chart'),

	render : function() {
    	$('#chart').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
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
	        plotOptions : {
	        	pie: {
	        		shadow: true,
	        		center: ['50%','50%']
	        	}
	        },
	        series : [{
	        	name: 'spalte1',
	        	data: dataSet1,
	        	dataLabels: {
	        		// formatter: function() {
	        		// 	return this.y > 1 ? this.point.name : null;
	        		// },
	        		color : 'black',
	        		size: '60%'
	        	}
	        },{
	        	name: 'spalte 2',
	        	data: dataSet2,
	        	size: '80%',
	        	innerSize: '60%',
	        	// dataLabels: {
	        	// 	formatter: function(){
	        	// 		return this.y > 1 ? '<b>' + this.point.name + ':</b> '+ this.y +'%'  : null;
	        	// 	}
	        	// }
	        }]
    	});
    	var dataSet1 = [];
    	var dataSet2 = [];
    	var colors = Highcharts.getOptions().colors;
    	for(var i = 0; i < App.model.data.categories.length; i++){

    		dataSet1.push({
    			name: App.model.data.categories[i],
    			y: App.model.data.series[i].data[0]+App.model.data.series[i].data[1],
    			color: colors[i]
    		});

    		for(var j = 0; j < App.model.data.series[i].data.length; j++){
    			var brightness = 0.2 - (j / App.model.data.series[i].data.length) / 5;
    			dataSet2.push({
    				name: App.model.data.series[j].name,
    				y: App.model.data.series[i].data[j],
    				color: Highcharts.Color(colors).brighten(brightness).get()
    			});
    		}
    	}
    	console.log(dataSet1);
    	console.log(dataSet2);
    }

};