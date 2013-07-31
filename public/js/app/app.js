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

    $('#save-search-button').click(function() {
        var data = $('form#save-search-form').formstate(':visible');
        App.searches.add(data.bookmarkname, App.filter.getFilter());
        App.searches.render();
        $('#save-search-modal').modal('hide');
    });

    $(document).on('click', '#search-list a', function(e) {
        var id = $(this).attr('data-bookmark-id');
        App.filter.setFilter(App.searches.saved_searches[id]);
        e.preventDefault();
    });

    $('#filter-form select[name="heimatland"]').change(function() {
        if ($(this).val() == "Deutschland") {
            $('#bundesland').slideDown();
        } else {
            if ($('#bundesland').css('display') != 'none') {
                $('#bundesland').slideUp();
            }
        }
    });

    App.searches.init();
    
    // Initiales zeichnen des Balkendiagramms
    App.columnchart.render();
};

/*
 * Erstellt eine Alertbox in der UI, um den User zu informieren.
 * Beispiel Objekt was uebergeben werden kann:
 * {
 *    alert : 'error',
 *    heading : 'Verbindungsfehler!',
 *    message : 'Es konnte keine Verbindung zum Server aufgebaut werden!',
 *    remove_after : 5000  
 * }
 * message ist Pflichtfeld, wenn fehlend wird Exception geworfen.
 */

App.showAlert = function(alert_config) {
    var alert_type = '-info';
    var time = (new Date()).getTime();

    if (alert_config.type) {
        alert_type = '-' + alert_config.type; 
    }
    var alert = '<div data-showup="' + time + '" class="alert alert' + alert_type + '"><button type="button" class="close" data-dismiss="alert">&times;</button>';
    if (alert_config.heading) {
        alert += '<h4>' + alert_config.heading + '</h4>';
    }
    if ( ! alert_config.message) {
        throw "No alert message definied!";
    }
    if (alert_config.remove_after) {
        setTimeout(function(){
          if ($('div.alert[data-showup="'+ time +'"]').length > 0) {
            $('div.alert[data-showup="'+ time +'"]').slideUp(400, function(){$(this).remove()});
          }
        }, alert_config.remove_after);
    }
    alert += alert_config.message + '</div>';
    $(alert).hide().prependTo('#content').slideDown();
}
