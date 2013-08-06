/* 
 * Kapselt den Zugriff auf die Immatrikulationsdaten und regelt die
 * Kommuninkation mit dem Server.
 */

var App = App || {};

App.model = {

	init : function() {
		radio('filter.submit').subscribe(this.submitListener);
	},
	
	submitListener : function() {
		App.model.fetch(App.filter.getFilter());
	},

	// Enthaelt immer den aktuellen Datensatz
	data : {
		categories : ['Deutschland','Schweiz','Österreich'],
		title : 'Test der Laender',
		series : 
		[{
            name: 'Maenner',
            data: [2600, 2100]
            
        },{
        	name: 'Frauen',
        	data: [2600]
        },{
        	name: 'Kinder',
        	data: [900, 600, 800]
        }]
	},
	/*
	 * einfügen der Daten für gMaps 
	 */

	"data_gmaps":[{"country_iso_code":"","longitude":0.0,"latitude":0.0,"number":37},{"country_iso_code":"AF","longitude":67.709953,"latitude":33.93911,"number":6},{"country_iso_code":"AG","longitude":-61.796428,"latitude":17.060816,"number":1},{"country_iso_code":"AM","longitude":45.038189,"latitude":40.069099,"number":19},{"country_iso_code":"AR","longitude":-63.61667199999999,"latitude":-38.416097,"number":14},{"country_iso_code":"AT","longitude":14.550072,"latitude":47.516231,"number":59},{"country_iso_code":"AU","longitude":133.775136,"latitude":-25.274398,"number":11},{"country_iso_code":"AZ","longitude":47.576927,"latitude":40.143105,"number":4},{"country_iso_code":"Africa","longitude":34.508523,"latitude":-8.783195,"number":1},{"country_iso_code":"BA","longitude":17.679076,"latitude":43.915886,"number":23},{"country_iso_code":"BB","longitude":-59.543198,"latitude":13.193887,"number":1},{"country_iso_code":"BD","longitude":90.356331,"latitude":23.684994,"number":4},{"country_iso_code":"BE","longitude":4.469936,"latitude":50.503887,"number":26},{"country_iso_code":"BF","longitude":-1.561593,"latitude":12.238333,"number":2},{"country_iso_code":"BG","longitude":25.48583,"latitude":42.733883,"number":180},{"country_iso_code":"BJ","longitude":2.315834,"latitude":9.30769,"number":1},{"country_iso_code":"BO","longitude":-63.58865299999999,"latitude":-16.290154,"number":5},{"country_iso_code":"BR","longitude":-51.92528,"latitude":-14.235004,"number":44},{"country_iso_code":"BY","longitude":27.953389,"latitude":53.709807,"number":204},{"country_iso_code":"CA","longitude":-106.346771,"latitude":56.130366,"number":30},{"country_iso_code":"CD","longitude":21.758664,"latitude":-4.038333,"number":3},{"country_iso_code":"CF","longitude":20.939444,"latitude":6.611110999999999,"number":3},{"country_iso_code":"CH","longitude":8.227511999999999,"latitude":46.818188,"number":52},{"country_iso_code":"CI","longitude":-5.547079999999999,"latitude":7.539988999999999,"number":6},{"country_iso_code":"CL","longitude":-71.542969,"latitude":-35.675147,"number":18},{"country_iso_code":"CM","longitude":12.354722,"latitude":7.369721999999999,"number":22},{"country_iso_code":"CN","longitude":104.195397,"latitude":35.86166,"number":677},{"country_iso_code":"CO","longitude":-74.297333,"latitude":4.570868,"number":16},{"country_iso_code":"CR","longitude":-83.753428,"latitude":9.748916999999999,"number":3},{"country_iso_code":"CY","longitude":33.429859,"latitude":35.126413,"number":3},{"country_iso_code":"CZ","longitude":15.472962,"latitude":49.81749199999999,"number":70},{"country_iso_code":"DE","longitude":10.451526,"latitude":51.165691,"number":61513,"federal_states":[{"federal_state_iso_code":"BB","longitude":13.2162494,"latitude":52.1313922,"number":242,"cities":[]},{"federal_state_iso_code":"BE","longitude":13.4060912,"latitude":52.519171,"number":332,"cities":[]},{"federal_state_iso_code":"BW","longitude":9.3501336,"latitude":48.6616037,"number":866,"cities":[]},{"federal_state_iso_code":"BY","longitude":11.4978895,"latitude":48.7904472,"number":557,"cities":[]},{"federal_state_iso_code":"HB","longitude":8.8016937,"latitude":53.07929619999999,"number":745,"cities":[]},{"federal_state_iso_code":"HE","longitude":9.162437599999999,"latitude":50.6520515,"number":889,"cities":[]},{"federal_state_iso_code":"HH","longitude":9.9936818,"latitude":53.5510846,"number":584,"cities":[]},{"federal_state_iso_code":"MV","longitude":12.4295953,"latitude":53.6126505,"number":310,"cities":[]},{"federal_state_iso_code":"NDS","longitude":9.8450765,"latitude":52.6367036,"number":39699,"cities":[]},{"federal_state_iso_code":"NRW","longitude":7.661593799999999,"latitude":51.43323669999999,"number":15137,"cities":[]},{"federal_state_iso_code":"RP","longitude":7.3089527,"latitude":50.118346,"number":365,"cities":[]},{"federal_state_iso_code":"SA","longitude":11.6922735,"latitude":51.9502649,"number":314,"cities":[]},{"federal_state_iso_code":"SH","longitude":9.696116700000001,"latitude":54.21936720000001,"number":974,"cities":[]},{"federal_state_iso_code":"SL","longitude":7.0229607,"latitude":49.3964234,"number":53,"cities":[]},{"federal_state_iso_code":"SN","longitude":13.2017384,"latitude":51.1045407,"number":241,"cities":[]},{"federal_state_iso_code":"TH","longitude":10.845346,"latitude":51.0109892,"number":205,"cities":[]}]},{"country_iso_code":"DJ","longitude":42.590275,"latitude":11.825138,"number":1},{"country_iso_code":"DK","longitude":9.501785,"latitude":56.26392,"number":19},{"country_iso_code":"DZ","longitude":1.659626,"latitude":28.033886,"number":7},{"country_iso_code":"EC","longitude":-78.18340599999999,"latitude":-1.831239,"number":5},{"country_iso_code":"EE","longitude":25.013607,"latitude":58.595272,"number":8},{"country_iso_code":"EG","longitude":30.802498,"latitude":26.820553,"number":48},{"country_iso_code":"ER","longitude":39.782334,"latitude":15.179384,"number":1},{"country_iso_code":"ES","longitude":-3.74922,"latitude":40.46366700000001,"number":228},{"country_iso_code":"ET","longitude":40.489673,"latitude":9.145000000000001,"number":11},{"country_iso_code":"FI","longitude":25.748151,"latitude":61.92410999999999,"number":65},{"country_iso_code":"FR","longitude":2.213749,"latitude":46.227638,"number":501},{"country_iso_code":"GA","longitude":11.609444,"latitude":-0.803689,"number":1},{"country_iso_code":"GB","longitude":-3.435973,"latitude":55.378051,"number":266},{"country_iso_code":"GE","longitude":43.35689199999999,"latitude":42.315407,"number":102},{"country_iso_code":"GH","longitude":-1.023194,"latitude":7.946527,"number":16},{"country_iso_code":"GN","longitude":-9.696645,"latitude":9.945587,"number":7},{"country_iso_code":"GR","longitude":21.824312,"latitude":39.074208,"number":71},{"country_iso_code":"GT","longitude":-90.23075899999999,"latitude":15.783471,"number":3},{"country_iso_code":"HR","longitude":15.2,"latitude":45.1,"number":4},{"country_iso_code":"HT","longitude":-72.285215,"latitude":18.971187,"number":1},{"country_iso_code":"HU","longitude":19.503304,"latitude":47.162494,"number":62},{"country_iso_code":"ID","longitude":106.8859437,"latitude":-6.355056599999999,"number":16},{"country_iso_code":"IE","longitude":-8.24389,"latitude":53.41291,"number":16},{"country_iso_code":"IL","longitude":34.851612,"latitude":31.046051,"number":9},{"country_iso_code":"IN","longitude":78.96288,"latitude":20.593684,"number":93},{"country_iso_code":"IQ","longitude":43.679291,"latitude":33.223191,"number":3},{"country_iso_code":"IR","longitude":53.688046,"latitude":32.427908,"number":33},{"country_iso_code":"IS","longitude":-19.020835,"latitude":64.963051,"number":1},{"country_iso_code":"IT","longitude":12.56738,"latitude":41.87194,"number":144},{"country_iso_code":"JM","longitude":-77.297508,"latitude":18.109581,"number":2},{"country_iso_code":"JO","longitude":36.238414,"latitude":30.585164,"number":7},{"country_iso_code":"JP","longitude":138.252924,"latitude":36.204824,"number":80},{"country_iso_code":"KE","longitude":37.906193,"latitude":-0.023559,"number":6},{"country_iso_code":"KG","longitude":74.766098,"latitude":41.20438,"number":16},{"country_iso_code":"KH","longitude":104.990963,"latitude":12.565679,"number":2},{"country_iso_code":"KP","longitude":127.510093,"latitude":40.339852,"number":3},{"country_iso_code":"KR","longitude":127.766922,"latitude":35.907757,"number":52},{"country_iso_code":"KZ","longitude":66.923684,"latitude":48.019573,"number":62},{"country_iso_code":"LB","longitude":35.862285,"latitude":33.854721,"number":3},{"country_iso_code":"LK","longitude":80.77179699999999,"latitude":7.873053999999999,"number":3},{"country_iso_code":"LT","longitude":23.881275,"latitude":55.169438,"number":81},{"country_iso_code":"LU","longitude":6.129582999999999,"latitude":49.815273,"number":5},{"country_iso_code":"LV","longitude":24.603189,"latitude":56.879635,"number":23},{"country_iso_code":"LY","longitude":17.228331,"latitude":26.3351,"number":2},{"country_iso_code":"MA","longitude":-7.092619999999999,"latitude":31.791702,"number":81},{"country_iso_code":"MD","longitude":28.369885,"latitude":47.411631,"number":14},{"country_iso_code":"ME","longitude":19.37439,"latitude":42.708678,"number":16},{"country_iso_code":"MK","longitude":21.745275,"latitude":41.608635,"number":3},{"country_iso_code":"MN","longitude":103.846656,"latitude":46.862496,"number":28},{"country_iso_code":"MO","longitude":113.543873,"latitude":22.198745,"number":2},{"country_iso_code":"MR","longitude":-10.940835,"latitude":21.00789,"number":1},{"country_iso_code":"MW","longitude":34.301525,"latitude":-13.254308,"number":12},{"country_iso_code":"MX","longitude":-102.552784,"latitude":23.634501,"number":23},{"country_iso_code":"MY","longitude":101.975766,"latitude":4.210484,"number":6},{"country_iso_code":"MZ","longitude":35.529562,"latitude":-18.665695,"number":1},{"country_iso_code":"NA","longitude":18.49041,"latitude":-22.95764,"number":2},{"country_iso_code":"NE","longitude":8.081666,"latitude":17.607789,"number":1},{"country_iso_code":"NG","longitude":8.675277,"latitude":9.081999,"number":10},{"country_iso_code":"NL","longitude":5.291265999999999,"latitude":52.132633,"number":68},{"country_iso_code":"NO","longitude":8.468945999999999,"latitude":60.47202399999999,"number":6},{"country_iso_code":"NP","longitude":84.12400799999999,"latitude":28.394857,"number":2},{"country_iso_code":"NZ","longitude":174.885971,"latitude":-40.900557,"number":10},{"country_iso_code":"PA","longitude":-80.782127,"latitude":8.537981,"number":2},{"country_iso_code":"PE","longitude":-75.015152,"latitude":-9.189967,"number":15},{"country_iso_code":"PH","longitude":121.774017,"latitude":12.879721,"number":4},{"country_iso_code":"PK","longitude":69.34511599999999,"latitude":30.375321,"number":32},{"country_iso_code":"PL","longitude":19.145136,"latitude":51.919438,"number":402},{"country_iso_code":"PT","longitude":-8.224454,"latitude":39.39987199999999,"number":73},{"country_iso_code":"PW","longitude":134.58252,"latitude":7.514979999999999,"number":1},{"country_iso_code":"PY","longitude":-58.443832,"latitude":-23.442503,"number":7},{"country_iso_code":"RO","longitude":24.96676,"latitude":45.943161,"number":161},{"country_iso_code":"RS","longitude":21.005859,"latitude":44.016521,"number":8},{"country_iso_code":"RU","longitude":105.318756,"latitude":61.52401,"number":601},{"country_iso_code":"RW","longitude":29.873888,"latitude":-1.940278,"number":1},{"country_iso_code":"SA","longitude":45.079162,"latitude":23.885942,"number":1},{"country_iso_code":"SD","longitude":30.217636,"latitude":12.862807,"number":8},{"country_iso_code":"SE","longitude":18.643501,"latitude":60.12816100000001,"number":54},{"country_iso_code":"SG","longitude":103.819836,"latitude":1.352083,"number":6},{"country_iso_code":"SI","longitude":14.995463,"latitude":46.151241,"number":12},{"country_iso_code":"SK","longitude":19.699024,"latitude":48.669026,"number":55},{"country_iso_code":"SL","longitude":-11.779889,"latitude":8.460555,"number":3},{"country_iso_code":"SN","longitude":-14.452362,"latitude":14.497401,"number":1},{"country_iso_code":"ST","longitude":6.613080999999999,"latitude":0.18636,"number":2},{"country_iso_code":"SY","longitude":38.996815,"latitude":34.80207499999999,"number":14},{"country_iso_code":"TG","longitude":0.824782,"latitude":8.619543,"number":4},{"country_iso_code":"TH","longitude":100.992541,"latitude":15.870032,"number":10},{"country_iso_code":"TN","longitude":9.537499,"latitude":33.886917,"number":28},{"country_iso_code":"TR","longitude":35.243322,"latitude":38.963745,"number":294},{"country_iso_code":"TW","longitude":120.960515,"latitude":23.69781,"number":3},{"country_iso_code":"TZ","longitude":34.888822,"latitude":-6.369028,"number":3},{"country_iso_code":"UA","longitude":31.16558,"latitude":48.379433,"number":142},{"country_iso_code":"UG","longitude":32.290275,"latitude":1.373333,"number":5},{"country_iso_code":"US","longitude":-95.712891,"latitude":37.09024,"number":210},{"country_iso_code":"UY","longitude":-55.765835,"latitude":-32.522779,"number":5},{"country_iso_code":"UZ","longitude":64.585262,"latitude":41.377491,"number":14},{"country_iso_code":"VE","longitude":-66.58973,"latitude":6.42375,"number":12},{"country_iso_code":"VN","longitude":108.277199,"latitude":14.058324,"number":5},{"country_iso_code":"YE","longitude":48.516388,"latitude":15.552727,"number":2},{"country_iso_code":"ZA","longitude":22.937506,"latitude":-30.559482,"number":5},{"country_iso_code":"ZM","longitude":27.849332,"latitude":-13.133897,"number":2},{"country_iso_code":"ZW","longitude":29.154857,"latitude":-19.015438,"number":2}],

	/*
	 * Holt einen neuen Datensatz mit den uebergebenen Filtern aus
	 * der Datenbank
	 */


	 /*
	 	TODO: Post Objekt zusammenbauen 
	 		  Post Objekt mit URL suchen
	 */


	fetch : function(filter) {
		radio('model.fetch').broadcast();
		App.filter.extendFilter();

		var formstate = App.filter.getFilter();

		$.post('/searches/new');


		$.getJSON('searches/1.json?representation=highcharts', function(data) {
			App.model.data = data.data;
		}).fail(function() {
			App.showAlert({
				type: 'danger', 
				heading: 'Verbindungsfehler!', 
				message: 'Die Verbindung zum Server ist fehlgeschlagen!'
			});
		}).always(function(){
			radio('model.fetched').broadcast();
		});
		console.log(this.data);
		return this.data;
	},

	/* 
	 * Fuehrt eine neue Suche aus indem ein POST-Objekt 
	 * zur Rails Anwendung geschickt wird
	 */
	
	post : function(filter) {
		//Testweise
		$.post('searches/student.html', function(data){
			var string = 'ein lustiger String';
		})}


}; 