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
		country_iso_code : 'Heimatland',
		kind_of_degree : 'Abschluss',
		federal_state_name : 'Bundesland',
		teaching_unit_name : 'Lehreinheit',
		department_number : 'Fachbereich',
		graduation_status : 'Studenten/Absolventen'
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
	    $('#filter-form button[name="store"]').click(function() {
	        radio('filter.submit').broadcast();
	        return false;
	    });
	    
	    // Event fuer Reset Button
	    $('#filter-form button[name="restore"]').click(function() {
	    	$('#filter-form')[0].reset();
	    	App.filter.setFilterOption('department_number', '');
	    	App.filter.setFilterOption('kind_of_degree', '');
	    	return false;
	    });

	    // Event für Alle Jahre Button
	    $('button[name="sliderReset"]').click(function() {
	    	$('#slider').slider().slider('setValue',1995);
	    	App.slider.setValue(App.slider.getMinValue());
	        return false;
	    });

	    //Wenn Nationalitäten ausgewählt wird, verstecke 
        $('#filter-form select[name="country_iso_code"]').change(function() {
	       
	        if ($(this).val() == "DE") {
	        	$('#federal_state_name').slideDown(); 
	        } else {
	            if ($('#federal_state_name').css('display') != 'none') {
	                $('#federal_state_name').slideUp();
	            }
	            
	        }
	    });

		//Wenn 1.Studienfach ausgewählt wird, verstecke 
        $('#filter-form select[name="discipline_name"]').change(function() {
	       
	        if ($(this).val() != "") {
	         
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
	    	
	    	
	    	App.filter.setFilterOption(App.filter.filter.search_series, series);
	    	App.filter.setFilterOption(App.filter.filter.search_category, category);
	    	App.filter.setFilterOption('search_category', filter);
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
		this.filter = $('#filter-form :visible').formstate();
		$.extend(this.filter, $('#filter-form select[name="department_number"]').formstate());
		$.extend(this.filter, $('#filter-form select[name="kind_of_degree"]').formstate());
		return this.filter;
    },

	/*
     * Laedt den Zustand des Filterformulars aus einem JSON-Objekt.
     */
    setFilter : function(filter) {
    	this.filter = filter;
    	$('#filter-form').formstate(this.filter);
    	$('#department').multiselect('refresh');
    	$('#kind_of_degree').multiselect('refresh');
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
    	$('#filter-form').formstate(this.filter);
    	if (input == "country_iso_code") {
    		$('#filter-form select[name="country_iso_code"]').change();
    	} else if(input == 'department_number') {
    		$('#department').multiselect('refresh');
    	} else if(input == 'kind_of_degree') {
    		$('#kind_of_degree').multiselect('refresh');
    	}
    },

    /*
     * Gibt einen String mit einer HTML-Liste zurueck in der die akutell
     * verfuegbaren Drilldown-Filter enthalten sind. 
     */
    getAvailableFilters : function(category, series_name) {
    	var filter = App.filter.getFilter();
    	var returnString = '<ul>';

    	console.log('Cat: ' + category);
		console.log('series: ' + series_name);

    	$.each(this.mapping, function(index,value) {
    		var available = false;
    		if (filter[index] instanceof Array) {
    			if (filter[index].length == 0) {
    				available = true;
    			}
    			if ((index == 'gender' || index == 'graduation_status') 
    				&& filter[index].length == 2) {
    				available = true;
    			}
    		} else if (filter[index] == '' || filter[index] == null || filter[index] == undefined) {
    			available = true;
    		}
			if (filter['search_category'] == index || filter['search_series'] == index) {
				available = false;
	    	}
	    	if (available) {
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