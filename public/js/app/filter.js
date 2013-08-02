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
		





		if (new_filter.filter == 'Maenner') {
			this.filter.geschlecht = ['m'];
		} else if (new_filter.filter == 'Frauen') {
			this.filter.geschlecht = ['w'];
		} else if (new_filter.filter == 'Studenten') {
			this.filter.studentenart = ['s'];
		} else if (new_filter.filter == 'Absolventen') {
			this.filter.studentenart = ['a'];
		}
		this.filter.heimatland = new_filter.category;
		if(this.filter.heimatland == "Deutschland"){
			$('#bundesland').slideDown();
		}
		else{
			$('#bundesland').slideUp();
		}
		$('#filter-form :input:visible').formstate(this.filter);
    }

};