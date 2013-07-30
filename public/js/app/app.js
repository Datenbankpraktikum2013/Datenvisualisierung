var App = App || {};

App.init = function() {
	$.cookie.json = true;
    if ($.cookie('formstate')) {
    	$('form :input:visible').formstate($.cookie('formstate'));
    }
    
    $('button[name="store"]').click(function() {
        App.model.fetch(App.filter.getFilter());
        App.columnchart.render();
        $.cookie('formstate', $('form').formstate(':visible'));
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

    $('form input, form select').change(function() {
        App.filter.getFilter();
    });
    
    
    App.columnchart.render();
};
