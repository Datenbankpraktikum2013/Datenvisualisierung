var App = App || {};

App.animator = {
	
	intervalID : null,

	interval : 1500,

	init : function() {

	},

	play : function() {
		if (this.intervalID == null) {
			this.intervalID = setInterval(this.next_step, this.interval);
		}
	},

	next_step : function() {
		if (App.slider.getValue() < App.slider.getMaxValue()) {
			App.slider.setValue(App.slider.getValue() + 0.5);
			App.chart.render();
		} else {
			App.animator.stop();
		}
	},

	stop : function() {
		clearInterval(this.intervalID);
		this.intervalID = null;
	}
	
};
