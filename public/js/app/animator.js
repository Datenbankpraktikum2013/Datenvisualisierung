var App = App || {};

App.animator = {
	
	init : function() {

	},

	play : function(year) {
		
		if(App.filter.filter == undefined){
			App.filter.filter = 1995;
		}
		while ($('#playButton').attr('data-toggled') == 'off' && App.filter.filter.year < 2012.5){
			App.filter.filter.year += 1;
			$('#slider').slider('setValue',App.filter.filter.year);
			//redraw;
			setTimeout(App.animator.play, 5000);
			console.log("test");
		}	
		if(App.filter.filter.year == 2013){
			$('#slider').slider('setValue',1995);
			$('#playButton').attr('data-toggled', 'on');
			$('#playButton').html('<i class="icon-play"></i> Abspielen');
		}
		if(App.filter.filter.year == 2012.5){
			$('#slider').slider('setValue',1995.5);
			$('#playButton').attr('data-toggled', 'on');
			$('#playButton').html('<i class="icon-play"></i> Abspielen');
		}
	}
	
};
