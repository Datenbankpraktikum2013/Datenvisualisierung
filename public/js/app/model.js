/* 
 * Kapselt den Zugriff auf die Immatrikulationsdaten und regelt die
 * Kommuninkation mit dem Server.
 */

var App = App || {};

App.model = {
	
	// Enthaelt immer den aktuellen Datensatz
	data : {
		categories : ['Deutschland','Schweiz'],
		title : 'Test der Laender',
		series : 
		[{
            name: 'Maenner',
            data: [2600, 2100]
            
        },{
        	name: 'Frauen',
        	data: [2600]
        }]
	},

	// Holt einen neuen Datensatz mit den uebergebenen Filtern aus
	// der Datenbank
	fetch : function(filter) {
		return this.data;
	}

}; 