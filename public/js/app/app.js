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
        App.model.fetch(App.filter.getFilter());
        App.columnchart.render();
        return false;
    });
    
    $('button[name="piechart"]').click(function() {
        App.model.fetch(App.filter.getFilter());
        App.piechart.render();
        return false;
    });

    $('form input, form select').change(function() {
        App.filter.getFilter();
    });
    
    
    App.columnchart.render();
};
