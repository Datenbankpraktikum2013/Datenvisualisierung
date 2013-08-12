var App = App || {};

App.slider = {

	slider_options : {
		min : 1994.5,
		max : 2013,
		step: 0.5,
		value : 1994.5,
		orientation : 'horizontal',
		selection : 'none',
		tooltip : 'hide',
		handle : 'round'
	},

	value : 1994.5,

	playButton : {
		el : null,
		toggle : function() {
			if (this.el.attr('data-toggled') == 'on') {
	            this.el.attr('data-toggled', 'off');
	            this.el.html('<i class="icon-pause"></i> Pause');
	            App.animator.play();
	        } else {
	            this.el.attr('data-toggled', 'on');
	            this.el.html('<i class="icon-play"></i> Abspielen');
	            App.animator.stop();
	        }
		}
	},

	init : function() {
		$('#slider').slider(this.slider_options);

	    // Listener für den Slider 
	    $('#slider').slider().on('slideStop', function(ev) {
            App.slider.setValue(ev.value);
            radio('filter.submit').broadcast();
        });
	        
	    // Erstellen der Jahresskala
	    $('#slider-form').jqtimeline({
	        numYears: 18,
	        startYear: 1995
	    });
	    
	    this.playButton.el = $('#playButton');
		this.playButton.el.click(function() {
	        App.slider.playButton.toggle();
	    });
	},

	setValue : function(new_value) {
		this.value = new_value;
		$('#slider').slider('setValue', this.value);
	},

	getValue : function() {
		if (this.value == 1994.5) {
			return 'All';
		}
		return this.value;
	},

	getMaxValue : function() {
		return this.slider_options.max;
	},
	getMinValue :function() {
		return this.slider_options.min;
	}
};