(function($) {
    var _state;
    var chart_type = 'bar';
    var chart;
    var data = [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }];
        
    $.cookie.json = true;
    if ($.cookie('formstate')) {
    	$('form :input:visible').formstate($.cookie('formstate'));
    }
    
    $('button[name="store"]').click(function() {
        _state = $('form').formstate(':visible');
        $.cookie('formstate', _state);
        return false;
    });
    
    $('button[name="restore"]').click(function() {
        $('form :input:visible').formstate($.cookie('formstate'));
        return false;
    });
    
    $('button[name="barchart"]').click(function() {
        chart_type = 'bar';
        renderChart();
        return false;
    });
    
    $('button[name="piechart"]').click(function() {
        chart_type = 'pie';
        renderChart();
        return false;
    });
    
    function renderChart() {
    	$('#chart').highcharts({
	        chart: {
	            type: chart_type
	        },
	        title: {
	            text: 'Fruit Consumption'
	        },
	        xAxis: {
	            categories: ['Apples', 'Bananas', 'Oranges']
	        },
	        yAxis: {
	            title: {
	                text: 'Fruit eaten'
	            }
	        },
	        series : data
    	});
    };
    renderChart();   
    
})(jQuery);
