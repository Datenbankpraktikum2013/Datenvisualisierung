var App = App || {};

App.animator = {
	
	intervalID : null,

	interval : 2000,

	init : function() {

	},

	play : function() {
		if (this.intervalID == null) {
			this.intervalID = setInterval(this.next_step, this.interval);
		}
	},

	next_step : function() {
		if (App.slider.getValue() < App.slider.getMaxValue() - 0.5) {
			App.slider.setValue(App.slider.getValue() + 1.0);
			App.chart.render();
		} else {
			App.animator.stop();
			if(App.slider.getValue() == App.slider.getMaxValue()){
				//$('#slider').slider().slider('setValue',App.slider.getMinValue());
				App.slider.setValue(App.slider.getMinValue() + 0.5);
				App.slider.playButton.toggle();
				this.intervalID = null;
			}
			if(App.slider.getValue() == App.slider.getMaxValue() - 0.5){
				//$('#slider').slider().slider('setValue',App.slider.getMinValue() + 1);
				App.slider.setValue(App.slider.getMinValue() + 1);
				App.slider.playButton.toggle();
				this.intervalID = null;
			}
		}
	},

	stop : function() {
		clearInterval(this.intervalID);
		this.intervalID = null;
	}
	
};
