/*
 * View-Model fuer die Chart-View. Speichert den Zustand der View
 * und kuemmert sich darum das Diagramm bei bedarf neu zu zeichnen. 
 */

var App = App || {};

App.chart = {

	current_chart : 'columnchart',

	init : function() {
		radio('model.fetch').subscribe(this.listener.loading);
		radio('model.hc.fetched').subscribe(this.listener.loadedHighCharts);
		radio('model.gmaps.fetched').subscribe(this.listener.loadedGoogleMaps);
		radio('model.globe.fetched').subscribe(this.listener.loadedGlobe);

		$('button[name="'+this.current_chart+'"]').addClass('active');

		// Event fuer Balkendiagramm Button
	    $('#chartswitch button').click(function() {
	    	if ( ! $(this).hasClass('disabled')) {
	    		App.chart.setChartType($(this).attr('name'));
	        }
	    	return false;
	    });
	},

	listener : {
		loading : function() {
			$('#chartswitch button').addClass('disabled');
			$('#chart').addClass('loading').spin();
		},

		loadedHighCharts : function() {
			$('#chartswitch button[name="columnchart"], #chartswitch button[name="piechart"]').removeClass('disabled');
			if (App.chart.current_chart != 'googlemaps') {
				App.chart.render();
			}
		},

		loadedGoogleMaps : function() {
			$('#chartswitch button[name="googlemaps"]').removeClass('disabled');
			if (App.chart.current_chart == 'googlemaps') {
				App.chart.render();
			}
		},

		loadedGlobe : function() {
			$('#chartswitch button[name="googleglobe"]').removeClass('disabled');
			if (App.chart.current_chart == 'googleglobe') {
				App.chart.render();
			}				
		}
	},

	updateChartSwitchView : function() {
		$('#chartswitch button').removeClass('active');
    	$('#chartswitch button[name="'+this.current_chart+'"]').addClass('active');
    	$('.popover').remove();
	},

	setChartType : function(new_chart_type) {
		if (this[new_chart_type] === undefined) {
			console.log('Charttyp nicht definiert!');
			return
		} 
		this.current_chart = new_chart_type;
		this.updateChartSwitchView();
		this.render();
	},

	showDrilldownPopup : function(el, event) {
		$('.popover').remove();
        var e = $(event.target).popover({
			title : '<strong>Diesen Datensatz aufteilen nach:</strong>',
			html : true,
			content : App.filter.getAvailableFilters(el.category, el.series.name),
			container : 'body',
			placement : 'right',
			trigger : 'manual',
			delay: { 
				show : '500',
				hide : '100'
			}
		}).popover('show');
		//Popover hides after 5s
		//setTimeout(function() {
		//	e.popover('hide')
		//}, 3000);
	},

	render : function() {
		$('#chart').removeClass('loading');
		$('#chart').attr('style','');
		this[this.current_chart].render();
	}

};