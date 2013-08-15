var App = App || {};

App.animator = {
	
	timeoutID : null,

	interval : 1500,

	init : function() {

	},

	listener : {
		loaded : function() {

		}
	},

	play : function() {
		if (App.chart.current_chart == "columnchart") {
			App.chart.render_type = "update";
		}
		if (App.chart.current_chart == 'columnchart' || App.chart.current_chart == 'piechart') {
			radio('model.hc.fetched').subscribe(this.setDelay);		
		} else if (App.chart.current_chart == "googlemaps") {
			radio('model.gmaps.fetched').subscribe(this.setDelay);		
		} else if (App.chart.current_chart == 'googleglobe') {
			radio('model.globe.fetched').subscribe(this.setDelay);		
		}
		this.setDelay();
	},

	setDelay : function() {
		App.animator.timeoutID = setTimeout(App.animator.next_step, App.animator.interval);
	},

	next_step : function() {
		if (App.slider.getValue() < App.slider.getMaxValue() - 0.5) {
			App.slider.setValue(App.slider.getValue() + 1.0);
			radio('filter.submit').broadcast();
		} else {
			App.animator.stop();
			if(App.slider.getValue() == App.slider.getMaxValue()){
				App.slider.setValue(App.slider.getMinValue() + 0.5);
				App.slider.playButton.toggle();
				clearInterval(App.animator.timeoutID);
				App.animator.timeoutID = null;
			}
			if(App.slider.getValue() == App.slider.getMaxValue() - 0.5){
				App.slider.setValue(App.slider.getMinValue() + 1);
				App.slider.playButton.toggle();
				clearInterval(App.animator.timeoutID);
				App.animator.timeoutID = null;
			}
		}
	},

	stop : function() {
		clearInterval(this.timeoutID);
		this.timeoutID = null;
		App.chart.render_type = "new";
		radio('model.hc.fetched').unsubscribe(this.setDelay);		
			radio('model.gmaps.fetched').unsubscribe(this.setDelay);		
			radio('model.globe.fetched').unsubscribe(this.setDelay);		
	}
	
};
