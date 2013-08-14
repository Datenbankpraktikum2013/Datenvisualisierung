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
            globe.addData(App.model.data_globe, {format: 'magnitude', animated: true});
            globe.createPoints();
            new TWEEN.Tween(globe).to({time: 0},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
           globe.animate();
    }
  }
}