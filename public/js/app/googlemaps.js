/*
 *	Fasst alle Funktionalitaeten zusammen fuer die Anzeige der Google-Maps
 * gebraucht werden
 */

 var App = App || {};

 App.chart.googlemaps = {

 	/*if(App.model.data_gmaps.country_iso_code == 'DE'){
 		setmarker : function(latitude, longitude, title){
 		var marker = new google.maps.Marker({		
 			position: new google.maps.LatLng(App.model.data_gmaps.federal_states.cities.latitude,App.model.data_gmaps.federal_states.cities.longitude),
 			title: "Anzahl der Menschen: " + App.model.data_gmaps.federal_states.cities.number
 		});
 		marker.setMap(map);
 	}
 	}else{
 		setmarker : function(latitude, longitude, title){
 		var marker = new google.maps.Marker({		
 			position: new google.maps.LatLng(App.model.data_gmaps.latitude, App.model.data_gmaps.longitude),
 			title: "Anzahl der Menschen: " + App.model.data_gmaps.number
 		});
 		marker.setMap(map);
 	},*/

  addColorLayer : function () {
    layer = new google.maps.FusionTablesLayer({
      map: map,
      heatmap: { enabled: false },
      query: {
        select: "col3",
        from: "19rTks41BEHnaDg3LZnRptzmRt1Y1NTbI8c9hmEI",
        where: ""
      },
      options: {
        styleId: 2,
        templateId: 2
      }
    });
  },

 	render : function(){
    map = new google.maps.Map(document.getElementById('chart'), {
      maxZoom : 20,
      minZoom : 1,
      zoom: 6,
      center: new google.maps.LatLng(52, 10),
      streetViewControl: false,
      panControl: false,
      scaleControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.addColorLayer();  

 		//this.setmarker(52,10,"charttetewasdsad");
        
        //this.setmarker(52,10,"test");

        // var refresh = document.getElementById('refresh');
        // google.maps.event.addDomListener(refresh, 'click', refreshMap);

        // var clear = document.getElementById('clear');
        // google.maps.event.addDomListener(clear, 'click', clearClusters);

        // refreshMap();

 	}       

 }
