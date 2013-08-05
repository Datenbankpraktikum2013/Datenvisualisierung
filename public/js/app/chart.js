/*
 * View-Model fuer die Chart-View. Speichert den Zustand der View
 * und kuemmert sich darum das Diagramm bei bedarf neu zu zeichnen. 
 */

var App = App || {};

App.chart = {

	current_chart : 'columnchart',

	init : function() {
		radio('model.fetched').subscribe(this.dataChangedListener);

		$('button[name="'+this.current_chart+'"]').addClass('active');

		// Event fuer Balkendiagramm Button
	    $('#chartswitch button').click(function() {
	    	App.chart.setChartType($(this).attr('name'));
	        return false;
	    });
	    
	    /* Event fuer Tortendiagramm Button
	    $('#chartswitch-select select').change(function() {
	        App.chart.setChartType($(this).val());
	        return false;
	    });*/
	},

	updateChartSwitchView : function() {
		$('#chartswitch button').removeClass('active');
    	$('#chartswitch button[name="'+this.current_chart+'"]').addClass('active');
    	//$('#chartswitch-select select').val(this.current_chart);
	},

	dataChangedListener : function() {
		App.chart.render();
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

	render : function() {
		this[this.current_chart].render();
	}

};