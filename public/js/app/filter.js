/* 
 * Erfasst die Filter die ueber das Formular oder durch DrillDowns gesetzt
 * und speichert sie zwischen. 
 */

var App = App || {};

App.filter = {

	// Enthaelt ein Objekt in dem alle gesetzten Filter stehen.
	filter : {},

	init : function() {
		radio('model.fetch').subscribe(this.loadingListener);
		radio('model.fetched').subscribe(this.loadedListener);

		// Wenn Formular veraendert wird, update das Filter Objekt.
	    $('form input, form select').change(function() {
	        App.filter.getFilter();
	    });

		// Event fuer Aktualisieren Button
	    $('button[name="store"]').click(function() {
	        radio('filter.submit').broadcast();
	        //App.columnchart.render();
	        $.cookie('formstate', $('form').formstate(':visible'));
	        return false;
	    });
	    
	    // Event fuer Reset Button
	    $('button[name="restore"]').click(function() {
	        $('form :input:visible').formstate($.cookie('formstate'));
	        return false;
	    });

        $('#filter-form select[name="heimatland"]').change(function() {
	        if ($(this).val() == "Deutschland") {
	            $('#bundesland').slideDown();
	        } else {
	            if ($('#bundesland').css('display') != 'none') {
	                $('#bundesland').slideUp();
	            }
	        }
	    });

	    $('#filter-form input[name="status"]').change(function() {
	        if ($('#absolventenart').is(":checked") && !($('#studentenart').is(":checked"))){
	            $('#absolvent-hidden').slideDown();
	            $('#student-hidden').slideUp();
	        }
	        if (!$('#absolventenart').is(":checked") && !($('#studentenart').is(":checked"))){
	             $('#student-hidden').slideUp();
	             $('#absolvent-hidden').slideUp();
	        }
	        if ((!$('#absolventenart').is(":checked")) && $('#studentenart').is(":checked")){
	            $('#student-hidden').slideDown();
	            $('#absolvent-hidden').slideUp();
	        }
	        if ($('#absolventenart').is(":checked") && $('#studentenart').is(":checked")){
	            $('#absolvent-hidden').slideUp();
	            $('#student-hidden').slideUp();
	        }
	    });
	},

	// Liest die aktuellen Filter aus dem Formular und speichert sie.
	getFilter : function() {
		this.filter = $('#filter-form').formstate(':visible');
		return this.filter;
    },

    loadingListener : function(state) {
    	$('#filter-form button[name="store"]').button('loading');
    },

    loadedListener : function() {
		$('#filter-form button[name="store"]').button('reset');
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
						new_filter.groupby = 'Geschlecht';
		 				new_filter.stackby = 'Status';
					break;
					case 'Geschlecht': 
						new_filter.groupby = 'Fachbereich';
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
						new_filter.groupby = 'Status'; //Eventuell hier Schluss machen
		 				new_filter.stackby = 'Status';
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
				}
			break;
			case 'Geschlecht':
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': break;
					case 'Status': break;
					case 'Fachbereich': break;
					case 'Lehreinheit' : break;
					case 'Abschlussart' : break;
					case 'Studienfach' : break;
				}
			break;
			case 'Fachbereich': break;
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': break;
					case 'Status': break;
					case 'Fachbereich': break;
					case 'Lehreinheit' : break;
					case 'Abschlussart' : break;
					case 'Studienfach' : break;
				}
			case 'Lehreinheit' : break;
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': break;
					case 'Status': break;
					case 'Fachbereich': break;
					case 'Lehreinheit' : break;
					case 'Abschlussart' : break;
					case 'Studienfach' : break;
				}
			case 'Abschlussart' : break;
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': break;
					case 'Status': break;
					case 'Fachbereich': break;
					case 'Lehreinheit' : break;
					case 'Abschlussart' : break;
					case 'Studienfach' : break;
				}
			case 'Studienfach' : break;
				switch(new_filter.groupby)
				{ 
					case 'Geschlecht': break;
					case 'Status': break;
					case 'Fachbereich': break;
					case 'Lehreinheit' : break;
					case 'Abschlussart' : break;
					case 'Studienfach' : break;
				}
		}
		App.columnchart.render();
		//Suche
		//Redraw

		
	}
};