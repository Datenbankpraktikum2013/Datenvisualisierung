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
    App.slider.init();       

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
    var prependTo = alert_config.prependTo || '#content';
    
    $(alert).hide().prependTo(prependTo).slideDown();

};



