var App = App || {};

App.piechart = {
	el : $('#chart'),

	render : function() {
    	$('#chart').highcharts({
	        chart: {
	            type: 'pie'
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
	        series : App.model.data.series
    	});
    }

};