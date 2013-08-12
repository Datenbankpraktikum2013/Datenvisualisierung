/*
 *	Fasst alle Funktionalitaeten zusammen fuer die Anzeige des Geilen-Globes
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

      

      for (var j = 0; j < App.model.data_globe.length; j++) {
        globe.addData(App.model.data_globe.seriesA[0], 'magnitude', App.model.data_globe.seriesA[1]);
      }
      globe.createPoints();
      globe.animate();
        console.log('hier');
    };
  }
}    

 
