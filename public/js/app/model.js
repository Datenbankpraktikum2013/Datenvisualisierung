var App = App || {};

App.model = {
	
	data : {
		categories : ['Deutschland', 'Schweiz'],
		series : 
		[{
            name: 'Maenner',
            data: [2600, 2100]
            
        },{
            name: 'Frauen',
            data: [2600, 2100]
        }]
	},

	fetch : function(filter) {
		return this.data;
	}

}; 