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
      var globe = new DAT.Globe(container);
      console.log(globe);
      var i, tweens = [];

      var xhr;
      TWEEN.start();

      xhr = new XMLHttpRequest();
      xhr.open('GET', '/js/globe/students.json', true);
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            window.data = data;
            for (i=0;i<data.length;i++) {
              globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
            }
            globe.createPoints();
            globe.animate();
          }
        }
      };
      xhr.send(null);
    }
 	},    

 }
