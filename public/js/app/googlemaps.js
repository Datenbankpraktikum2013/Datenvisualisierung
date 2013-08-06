/*
 *	Fasst alle Funktionalitaeten zusammen fuer die Anzeige der Google-Maps
 * gebraucht werden
 */

 var App = App || {};

 App.chart.googlemaps = {

  markers : [],

  setmarker : function(latitude, longitude, title, number){ 		
 		 var marker = new google.maps.Marker({		
 			position: new google.maps.LatLng(latitude, longitude),
 			title: title + " : " + number
 		});
 		 marker.setMap(map);
     this.markers.push(marker);
  },

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
      },
      suppressInfoWindows : true
    });
  },

  markerClusterer: null,
  imageUrl: 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
          'chco=FFFFFF,008CFF,000000&ext=.png',

  addDomListener: google.maps.event.addDomListener(window, 'load', this.render),

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

    for(var i = 0; i < App.model.data_gmaps.length; i++){
      if(App.model.data_gmaps[i].country_iso_code == 'DE'){
          /* Marker für Deutschland, Zentral gelesen und absolute Anzhal.
           * Auskommentiert weil aktuell nicht gebraucht
           */ 
        //for(var v = 0; v < App.model.data_gmaps[i].number; v++){
        //this.setmarker(App.model.data_gmaps[i].latitude,App.model.data_gmaps[i].longitude, App.model.data_gmaps[i].country_iso_code, App.model.data_gmaps[i].number)
        // }
        for(var j = 0; j < App.model.data_gmaps[i].federal_states.length; j++){
          /* Marker für Bundesland, Zentral gelesen und absolute Anzhal.
           * Auskommentiert weil aktuell nicht gebraucht
           */
          //for(var c = 0; c < App.model.data_gmaps[i].federal_states[j].number; c++) {
          //this.setmarker(App.model.data_gmaps[i].federal_states[j].latitude,App.model.data_gmaps[i].federal_states[j].longitude,App.model.data_gmaps[i].federal_states[j].federal_states_iso_code, App.model.data_gmaps[i].federal_states[j].number);
          //}
          for(var n = 0; n < App.model.data_gmaps[i].federal_states[j].cities.length; n++){
            for(var b = 0; b < App.model.data_gmaps[i].federal_states[j].cities[n].number; b++){
              this.setmarker(App.model.data_gmaps[i].federal_states[j].cities[n].latitude,App.model.data_gmaps[i].federal_states[j].cities[n].longitude,App.model.data_gmaps[i].federal_states[j].cities[n].location_name,App.model.data_gmaps[i].federal_states[j].cities[n].number);
            }
          }
        }
      }else{
        for(var m = 0; m < App.model.data_gmaps[i].number; m++){
          this.setmarker(App.model.data_gmaps[i].latitude,App.model.data_gmaps[i].longitude, App.model.data_gmaps[i].country_iso_code, App.model.data_gmaps[i].number);
        }
      }
    }

    
    console.log(this.markers);
    var markerImage = new google.maps.MarkerImage(this.imageUrl, new google.maps.Size(24,32));

    var zoom = 7;
    var size = 40;
    var style = -1;
    zoom = zoom == -1 ? null : zoom;
    size = size == -1 ? null : size;
    style = style == -1 ? null : style;

    var markerClusterer = null;
    markerClusterer = new MarkerClusterer(map, this.markers, {
      maxZoom: zoom,
      gridSize: size,
    });

 	},    

 }
