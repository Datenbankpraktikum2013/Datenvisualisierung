var App = App || {};

App.filter = {

	filter : {},

	getFilter : function() {
		this.filter = $('form').formstate(':visible');
		console.log(this.filter);
		return this.filter;
    },

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
		$('form :input:visible').formstate(this.filter);
    }

};