/* 
 * Erfasst die Filter die ueber das Formular oder durch DrillDowns gesetzt
 * und speichert sie zwischen. 
 */

var App = App || {};

App.filter = {

	/*
	 * Enthaelt die aktuell gesetzten Filtereinstellungen.
	 */
	filter : {},

	/*
     * Mapping von Formularfeldnamen zu Anzeigetext.
     */
    mapping : {
		gender : 'Geschlecht',
		nationality : 'Heimatland',
		kind_of_degree : 'Abschluss',
		federal_state_name : 'Bundesland',
		teaching_unit_name : 'Lehreinheit',
		department_number : 'Fachbereich',
		graduation_status : 'Studenten/Absolventen',
		number_of_semesters : 'Zahl der benötigten Semester',
		number_of_semester : 'Aktuell im Fachsemester',
		discipline_name : '1. Studienfach',
		discipline_name2 : '2. Studienfach'
	},
	
	/*
     * Initialisierungs-Methode. Setzt alle noetigen Event-Bindings.
     */
    init : function() {
		radio('model.fetch').subscribe(this.listener.loading);
		radio('model.fetched').subscribe(this.listener.loaded);
		
		// Wenn Formular veraendert wird, update das Filter Objekt.
	    $('form input, form select').change(function() {
	        App.filter.getFilter();
	    });

		// Event fuer Aktualisieren Button
	    $('button[name="store"]').click(function() {
	        radio('filter.submit').broadcast();
	        return false;
	    });
	    
	    // Event fuer Reset Button
	    $('button[name="restore"]').click(function() {
	        return false;
	    });

	    // Event für Alle Jahre Button
	    $('button[name="sliderReset"]').click(function() {
	    	$('#slider').slider().slider('setValue',1968);
	        return false;
	    });

	    //Wenn Nationalitäten ausgewählt wird, verstecke 
        $('#filter-form select[name="nationality"]').change(function() {
	       
	        if ($(this).val() == "D") {
	        	$('#federal_state_name').slideDown(); 
	        } else {
	            if ($('#federal_state_name').css('display') != 'none') {
	                $('#federal_state_name').slideUp();
	            }
	            
	        }
	    });

		//Wenn Nationalitäten ausgewählt wird, verstecke 
        $('#filter-form select[name="discipline_name"]').change(function() {
	       
	        if ($(this).val() != "Kein") {
	         
	            $('#discipline_name2').slideDown(); 
	        } else {
	            if ($('#discipline_name2').css('display') != 'none') {
	                $('#discipline_name2').slideUp();
	            }
	            
	        }
	    });

	    $(document).on('click', 'a.drilldown', function(e) {
	    	var category = $(e.target).attr('data-category');
	    	var series = $(e.target).attr('data-series');
	    	var filter = $(e.target).attr('data-filter');
	    	console.log(category + series + filter);
	    	
	    	App.filter.setFilterOption(App.filter.groupby, category);
	    	App.filter.setFilterOption('search_category', filter);
	    	//App.filter.setFilterOption('search_series', series);
	    	e.preventDefault();
	    	radio('filter.submit').broadcast();
	    });

        //Wenn Studentenarten wie Absolvent oder Studenten
        //gewählt werden, dann mache Slide up, Slide down
	    $('#filter-form input[name="graduation_status"]').change(function() {
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
	
	/*
     * Enthaelt die Listener.
     */
    listener : {
		loading : function(state) {
	    	$('#filter-form button[name="store"]').button('loading');
	    },

	    loaded : function() {
			$('#filter-form button[name="store"]').button('reset');
	    }
	},

	/*
     * Liest den Zustand des Filterformulars aus speichert ihn als Objekt in einer 
     * Instanzvariablen und gibt diese auch zurueck.
     */
	getFilter : function() {
		this.filter = $('#filter-form').formstate();
		return this.filter;
    },

	/*
     * Laedt den Zustand des Filterformulars aus einem JSON-Objekt.
     */
    setFilter : function(filter) {
    	this.filter = filter;
    	$('#filter-form').formstate(this.filter);
    },

    /*
     * Setzt ein einzelnen Filter und trigger wenn noetig das change-Event
     * fuer das Element. Wird benoetigt zum setzen der Drilldown-Filter.
     */
    setFilterOption : function(input, value) {
    	this.filter[input] = value;
    	if (this.filter[input] === undefined) {
    		this.filter[input] = value;
    	} else if (this.filter[input] instanceof Array) {
    		this.filter[input] = [];
			this.filter[input].push(value);
    	}
    	$('#filter-form :visible').formstate(this.filter);
    	if (input == "nationality") {
    		$('#filter-form select[name="nationality"]').change();
    	}
    },

    /*
     * Gibt einen String mit einer HTML-Liste zurueck in der die akutell
     * verfuegbaren Drilldown-Filter enthalten sind. 
     */
    getAvailableFilters : function(category, series_name) {
    	var filter = App.filter.getFilter();
    	var returnString = '<ul>';

    	$.each(this.mapping, function(index,value) {
	    	if (filter[index] != '' && filter[index] != null) {
				returnString += '<li><a class="drilldown" href="#"'
									+ ' data-category="' + category 
									+'" data-series="' + series_name 
									+'" data-filter="'+ index +'">'
									+ value +'</li>';
	    	}
	    });
		returnString = returnString+'</ul>';
		return returnString;
	}
};