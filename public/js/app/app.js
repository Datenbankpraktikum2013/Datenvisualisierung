/* 
 * Kapselt alle allgemeinen Funktionen der Application.
 */

var App = App || {};

// Initialisiert die Applikation. z.B binding der events.
App.init = function() {
	
    App.model.init();
    App.filter.init();
    App.searches.init();
    App.chart.init();

    // Listener für den Slider 
    $('#slider').slider()
         .on('slideStop', function(ev){
            App.filter.filter.year = ev.value;
          });
        
    // Erstellen der Jahresskala
    $('#slider-form').jqtimeline({
        numYears: 18,
        startYear: 1995
    });

    
    $('#playButton').click(function() {
        if ($(this).attr('data-toggled') == 'on') {
            $(this).attr('data-toggled', 'off');
            $(this).html('<i class="icon-pause"></i> Pause');
        } else {
            $(this).attr('data-toggled', 'on');
            $(this).html('<i class="icon-play"></i> Abspielen');
        }
    });
   



    // Erstellen des Multiselects fuer die Fachbereichsauswahl
    $('.multiselect').multiselect({
        buttonWidth : false,
        buttonContainer : '<div class="row-fluid btn-group" />',
        buttonText: function(options) {
            if (options.length == 0) {
                return 'Fachbereiche auswählen <b class="caret"></b>';
            }
            else if (options.length > 1) {
                return options.length + ' ausgewählt <b class="caret"></b>';
            }
            else {
                var selected = '';
                options.each(function() {
                    selected += $(this).text() + ', ';
                });
                return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
            }
        }
    });

    // Initales abrufen der Immatrikulationsdaten
    App.model.fetch();

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
