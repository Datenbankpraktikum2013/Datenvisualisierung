/* 
 * Kapselt alle allgemeinen Funktionen der Application.
 */

var App = App || {};

// Initialisiert die Applikation. z.B binding der events.
App.init = function() {
	// Erlaubt Speicherung von JSON Objekt im Cookie
	$.cookie.json = true;
	// Wenn Formularstatus in Cookie gespeichert, wird er geladen.
    if ($.cookie('formstate')) {
    	$('form :input:visible').formstate($.cookie('formstate'));
    }
    
    // Event fuer Aktualisieren Button
    $('button[name="store"]').click(function() {
        App.model.fetch(App.filter.getFilter());
        App.columnchart.render();
        $.cookie('formstate', $('form').formstate(':visible'));
        return false;
    });
    
    // Event fuer Reset Button
    $('button[name="restore"]').click(function() {
        $('form :input:visible').formstate($.cookie('formstate'));
        return false;
    });
    
    // Event fuer Balkendiagramm Button
    $('button[name="barchart"]').click(function() {
    	$('#chartswitch button').removeClass('active');
    	$(this).addClass('active');
        App.model.fetch(App.filter.getFilter());
        App.columnchart.render();
        return false;
    });
    
    // Event fuer Tortendiagramm Button
    $('button[name="piechart"]').click(function() {
        $('#chartswitch button').removeClass('active');
    	$(this).addClass('active');
        App.model.fetch(App.filter.getFilter());
        App.piechart.render();
        return false;
    });

    // Wenn Formular veraendert wird, update das Filter Objekt.
    $('form input, form select').change(function() {
        App.filter.getFilter();
    });
    
    // Initiales zeichnen des Balkendiagramms
    App.columnchart.render();
};
