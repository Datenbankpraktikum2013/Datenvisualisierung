/*
 *	Fasst alle Funktionalitaeten zusammen fuer die Anzeige der Google-Maps
 * gebraucht werden
 */

 var App = App || {};

 App.chart.googleglobe = {

  
 	render : function(){
    if(false){
      Detector.addGetWebGLMessage();
    } else {

      var container = document.getElementById('chart');
      $('#chart').html('');
      var globe = new DAT.Globe(container);
      console.log(globe);
      var tweens = [];


      TWEEN.start();

      xhr = new XMLHttpRequest();
      xhr.open( 'GET', 'searches/166.json?representation=globe', true );
      xhr.onreadystatechange = function(e) {
        if ( xhr.readyState === 4 && xhr.status === 200 ) {
          var data = JSON.parse( xhr.responseText );
          for (var j = 0; j < App.model.data_globe.length; j++){
            globe.addData(App.model.data_globe[j], {format:'magnitude', animated: true});
          }
          globe.createPoints();
          globe.animate();
            // console.log(data[1][0]);
            console.log("array länge" + App.model.data_globe.length);
        }
      }
    };
  xhr.send( null );
  }
}    

 
