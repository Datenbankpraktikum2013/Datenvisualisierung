var App = App || {};

App.model = {
	
	data : [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }],

	fetch : function(filter) {
		return this.data;
	}

}; 