/* 
 * Erfasst die Filter die ueber das Formular oder durch DrillDowns gesetzt
 * und speichert sie zwischen. 
 */

var App = App || {};

App.filter = {
	// Enthaelt ein Objekt in dem alle gesetzten Filter stehen.
	filter : {},

	// Liest die aktuellen Filter aus dem Formular und speichert sie.
	getFilter : function() {
		this.filter = $('#filter-form').formstate(':visible');
		return this.filter;
    },

    setFilter : function(filter) {
    	this.filter = filter;
    	$('#filter-form :input:visible').formstate(this.filter);
    },

    // Setzt abhaengig des uebergebenen Daten die entsprechenden Filter
    // aus den DrillDownClicks.
    setDrillDownFilter : function(new_filter) {
    	var filters = App.filter.getFilter();
		
     	new_filter.groupby = filters.groupby; // X-Achse
     	new_filter.stackby = filters.stackby; // Y-Achse

  //   	if (new_filter.filter == 'm') {
		// 	this.filter.geschlecht = ['m'];
		// } else if (new_filter.filter == 'w') {
		// 	this.filter.geschlecht = ['w'];
		// } else if (new_filter.filter == 'Studenten') {
		// 	this.filter.studentenart = ['s'];
		// } else if (new_filter.filter == 'Absolventen') {
		// 	this.filter.studentenart = ['a'];
		// }
		// this.filter.heimatland = new_filter.category;
		// if(this.filter.heimatland == "Deutschland"){
		// 	$('#bundesland').slideDown();
		// }
		// else{
		// 	$('#bundesland').slideUp();
		// }

		// 				App.model.data = '[4123,2313]'
		// 				alert(App.model.data);
		// new_filter.groupby = 'Fachbereich';
		// 				new_filter.stackby = 'Geschlecht';
		// 				new_filter.geschlecht = this.filter.geschlecht;


		$('#filter-form :input:visible').formstate(this.filter);
  		
		switch(new_filter.stackby)
		{
			case 'Status':
				switch(new_filter.groupby)
				{ 
					case 'Status': 
						//Filter setzen
						new_filter.groupby = 'Geschlecht';
		 				new_filter.stackby = 'Status';
					break;
					case 'Geschlecht': 
						new_filter.groupby = 'Alter';
		 				new_filter.stackby = 'Status';
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
		 				new_filter.stackby = 'Status';

					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Studienfach';
		 				new_filter.stackby = 'Status';
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Abschlussart'; //Eventuell hier Schluss machen
		 				new_filter.stackby = 'Status';
		 			break;
					case 'Abschlussart' : 
						new_filter.stackby = 'Abschlussart';
						new_filter.groupby = 'Geschlecht';
						App.showAlert({
							type: 'info', 
							heading: 'Maximale Detailstufe', 
							message: 'Um weitere Informationen abzurufen bitte eine weitere Suche durchführen.'
						});
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Status';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Status';
						}
					break;
					case 'Keine' :
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Status';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Status' ;
					break;
				}break;

			case 'Geschlecht':
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht':
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Geschlecht';
		 			break;
					case 'Status':
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Geschlecht'
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
						new_filter.stackby = 'Geschlecht'
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Geschlecht'
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Geschlecht';
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Abschlussart'
						new_filter.stackby = 'Geschlecht';
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Geschlecht';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Geschlecht';
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Geschlecht';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Geschlecht';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Geschlecht';
					break;
				}break;

			case 'Fachbereich': break;
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht':
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Fachbereich'; 
					break;
					case 'Status':
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Fachbereich'; 
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
						new_filter.stackby = 'Fachbereich'; 
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Fachbereich'; 
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Fachbereich'; 
					break;
					case 'Studienfach' :
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Fachbereich';  
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Fachbereich';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Fachbereich';
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Fachbereich';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Fachbereich';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Fachbereich';
					break;
				}break;

			case 'Lehreinheit' :
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': 
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Lehreinheit'; 
					break;
					case 'Status': 
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Lehreinheit'; 
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Lehreinheit'; 
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Fachbereich';
						new_filter.stackby = 'Lehreinheit'; 
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Lehreinheit'; 						
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Lehreinheit'; 
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Lehreinheit';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Lehreinheit' ;
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Lehreinheit';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Lehreinheit';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Lehreinheit';
					break;
				}break;

			case 'Abschlussart' :
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': 
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Abschlussart'; 
					break;
					case 'Status': 
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Abschlussart'; 
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
						new_filter.stackby = 'Abschlussart'; 
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Studienfach';
						new_filter.stackby = 'Abschlussart'; 
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Fachbereich';
						new_filter.stackby = 'Abschlussart'; 						
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Studienfach';
						new_filter.stackby = 'Abschlussart'; 
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Abschlussart';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Abschlussart' ;
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Abschlussart';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Abschlussart';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Abschlussart';
					break;
				}break;

			case 'Studienfach' :
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': 
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Studienfach'; 
					break;
					case 'Status': 
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Studienfach'; 
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
						new_filter.stackby = 'Studienfach'; 
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Studienfach'; 
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Studienfach'; 
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Fachbereich';
						new_filter.stackby = 'Studienfach';
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Studienfach';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Studienfach' ;
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Studienfach';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Studienfach';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Studienfach';
					break;
				}break;

			case 'Land' :
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': 
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Land'; 
					break;
					case 'Status': 
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Land'; 
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
						new_filter.stackby = 'Land'; 
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Studienfach';
						new_filter.stackby = 'Land'; 
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Land'; 
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Land'; 
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Land';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Land' ;
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Land';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Land';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Land';
					break;
				}break;

			case 'Keine' : 
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': 
						new_filter.groupby = 'Alter';
						new_filter.stackby = 'Keine'; 
					break;
					case 'Status': 
						new_filter.groupby = 'Geschlecht';
						new_filter.stackby = 'Keine'; 
					break;
					case 'Fachbereich': 
						new_filter.groupby = 'Lehreinheit';
						new_filter.stackby = 'Keine'; 
					break;
					case 'Lehreinheit' : 
						new_filter.groupby = 'Studienfach';
						new_filter.stackby = 'Keine'; 
					break;
					case 'Abschlussart' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Keine'; 
					break;
					case 'Studienfach' : 
						new_filter.groupby = 'Abschlussart';
						new_filter.stackby = 'Keine'; 
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Keine';
					break;
					case 'Alter' :
						new_filter.groupby = 'Alter' ;
						new_filter.stackby = 'Keine' ;
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Keine';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Keine';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Keine';
					break;
				}break;

			case 'Alter' : 
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': 
						new_filter.stackby = 'Geschlecht';
						new_filter.groupby = 'Alter'; 
					break;
					case 'Status': 
						new_filter.stackby = 'Geschlecht';
						new_filter.groupby = 'Alter'; 
					break;
					case 'Fachbereich': 
						new_filter.stackby = 'Lehreinheit';
						new_filter.groupby = 'Alter'; 
					break;
					case 'Lehreinheit' : 
						new_filter.stackby = 'Studienfach';
						new_filter.groupby = 'Alter'; 
					break;
					case 'Abschlussart' : 
						new_filter.stackby = 'Abschlussart';
						new_filter.groupby = 'Alter'; 
					break;
					case 'Studienfach' : 
						new_filter.stackby = 'Abschlussart';
						new_filter.groupby = 'Alter'; 
					break;
					case 'Keine' :
						new_filter.groupby = 'Status';
						new_filter.stackby = 'Alter';
					break;
					case 'Alter' :
						new_filter.groupby = 'Status' ;
						new_filter.stackby = 'Alter' ;
					break;
					case 'Land' :
						if(new_filter.heimatland == 'de'){
							new_filter.groupby = 'Bundesland';
							new_filter.stackby = 'Alter';
						}
						else{
							new_filter.groupby = 'Land';
							new_filter.stackby = 'Alter';
						}
					break;
					case 'Bundesland' :
						new_filter.groupby = 'Bundesland';
						new_filter.stackby = 'Alter';
					break;
				}break;

		}
		//Neue Suche durchführen
		App.model.post(new_filter);

		//Suche abrufen
		App.model.fetch(App.model.getFilter());

		//Neu zeichnen
		App.columnchart.render();


		
	}
};