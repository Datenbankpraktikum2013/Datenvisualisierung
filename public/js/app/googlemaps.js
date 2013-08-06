/*
 *	Fasst alle Funktionalitaeten zusammen fuer die Anzeige der Google-Maps
 * gebraucht werden
 */

 var App = App || {};

 App.chart.googlemaps = {
  setmarker : function(latitude, longitude, title, number){ 		
 		 var marker = new google.maps.Marker({		
 			position: new google.maps.LatLng(latitude, longitude),
 			title: title + " : " + number
 		});
 		 marker.setMap(map); 
  },

  addColorLayer : function () {
    layer = new google.maps.FusionTablesLayer({
      map: map,
      heatmap: { enabled: false },
      query: {
        select: "col24",
        from: "18VIAMr_N2Q8_mx6c8NYCgueJ-EvlmPcmr07h2TA",
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
      maxZoom : 14,
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

   // this.setmarker(App.model.data_gmaps[0].latitude,App.model.data_gmaps[0].longitude, 'title', App.model.data_gmaps[0].number);
    for(var i = 0; i < App.model.data_gmaps.length; i++){
      if(App.model.data_gmaps[i].country_iso_code == 'DE'){
          /* Marker für Deutschland, Zentral gelesen und absolute Anzhal.
           * Auskommentiert weil aktuell nicht gebraucht
           */ 
        //this.setmarker(App.model.data_gmaps[i].latitude,App.model.data_gmaps[i].longitude, App.model.data_gmaps[i].country_iso_code, App.model.data_gmaps[i].number)
        for(var j = 0; j < App.model.data_gmaps[i].federal_states.length; j++){
          /* Marker für Bundesland, Zentral gelesen und absolute Anzhal.
           * Auskommentiert weil aktuell nicht gebraucht
           */ 
          //this.setmarker(App.model.data_gmaps[i].federal_states[j].latitude,App.model.data_gmaps[i].federal_states[j].longitude,App.model.data_gmaps[i].federal_states[j].federal_states_iso_code, App.model.data_gmaps[i].federal_states[j].number);
          for(var n = 0; n < App.model.data_gmaps[i].federal_states[j].cities.length; n++){
            this.setmarker(App.model.data_gmaps[i].federal_states[j].cities[n].latitude,App.model.data_gmaps[i].federal_states[j].cities[n].longitude,App.model.data_gmaps[i].federal_states[j].cities[n].location_name,App.model.data_gmaps[i].federal_states[j].cities[n].number);
          }
        }
      }else{
        this.setmarker(App.model.data_gmaps[i].latitude,App.model.data_gmaps[i].longitude, App.model.data_gmaps[i].country_iso_code, App.model.data_gmaps[i].number)
      }
    }

        // var refresh = document.getElementById('refresh');
        // google.maps.event.addDomListener(refresh, 'click', refreshMap);

        // var clear = document.getElementById('clear');
        // google.maps.event.addDomListener(clear, 'click', clearClusters);

        // refreshMap();

 	}       

 }
