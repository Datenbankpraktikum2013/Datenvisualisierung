/*
 * Bietet die Moeglichkeit eine Suchanfrage (Filtereinstellung)
 * zu speichern und spaeter wieder aufzurufen
 */

var App = App || {};

App.searches = {
	saved_searches : {},

	// Initialisierung
	init : function() {
    
	    $('#save-search-button').click(function() {
	        var data = $('form#save-search-form').formstate();
	        App.searches.add(data.bookmarkname, $('#filter-form').formstate());
	        App.searches.render();
	        $('#save-search-modal').modal('hide');
	    });

	    $(document).on('submit','form#save-search-form', function(e) {
	    	e.preventDefault();
	    	$('#save-search-button').click();	    	
	    });

	    $(document).on('click', '#search-list a', function(e) {
	        var id = $(this).attr('data-bookmark-id');
	        App.filter.setFilter(App.searches.saved_searches[id]);
	        radio('filter.submit').broadcast();
	        e.preventDefault();
	    });
	
		this.load();
		this.render();
	},
	// Neue Suche speichern
	add: function(name, filters) {
		this.saved_searches[name] = filters;
		this.persist();
	},
	// Eine Suche loeschen
	remove : function(name) {
		delete this.saved_searches[name];
		this.persist();
	},
	// Die Liste der aktuellen Suchen im LocalStorage speichern
	persist : function() {
		localStorage.setItem('searches', $.toJSON(this.saved_searches));
	},
	// Die Liste der gespeicherten Suchen aus dem LocalStorage laden
	load : function() {
		if (localStorage.getItem('searches')) {
			this.saved_searches = $.secureEvalJSON(localStorage.getItem('searches'));
		}
	},
	// Die Liste in das Dropmenu einfuegen
	render : function() {
		$('#search-list li.bookmarked-search').remove();
		var html_list = '';
		$.each(this.saved_searches, function(index, value) {
			html_list += '<li class="bookmarked-search"><a data-bookmark-id="'+ index +'" href="#"><i class="icon-search"></i> ' + index + '</a></li>';
		});
		$('#search-list').append(html_list);
	} 
}