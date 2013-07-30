var App = App || {};

App.columnchart = {

	render : function() {
    	$('#chart').highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: 'Fruit Consumption'
	        },
	        xAxis: {
	            categories: App.model.data.categories
	        },
	        yAxis: {
	            title: {
	                text: 'Fruit eaten'
	            }
	        },
	        plotOptions : {
	        	series : {
	        		stacking : 'normal'
	        	}
	        },
	        series : App.model.data.series
    	});
    }

};