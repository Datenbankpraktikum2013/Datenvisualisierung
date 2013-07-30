var App = App || {};

App.filter = {

	filter : {},

	getFilter : function() {
		this.filter = $('form').formstate(':visible');
		console.log(this.filter);
		return this.filter;
    }

};