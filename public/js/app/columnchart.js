var App = App || {};

App.columnchart = {

	options : {

	},

	render : function() {
    	$('#chart').highcharts({
	        chart: {
	            type: 'column'
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
	        plotOptions : {
	        	series : {
	        		stacking : 'normal'
	        	}
	        },
	        series : App.model.data.series
    	});
    }

};