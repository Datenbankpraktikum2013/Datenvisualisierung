/* 
 * Fasst alle Funktionalitaeten zusammen die fuer die Anzeige des Column-Charts
 * gebraucht werden.
 */

var App = App || {};

App.chart.columnchart = {
	// Konfigurationsdaten fuer das Balkendiagramm.
	config : {
        chart: {
            type: 'column',
            events: {
                redraw: function(){},
                load: function(){
                    this.hideLoading();
                   
                },
                addSeries: function(){
                    this.redraw();
                },
                click : function() {}
            },
            zoomType: 'xy',
            pinchType: 'xy'
        },
        title: {
            text: "Ihre Suche",
            style: {
                fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: App.model.data.categories,
            labels : {
                rotation : -45,
                align : 'right'
            }
        },
        yAxis: {
            title: {
                text: 'Anzahl'
            }
        },
        loading: {
              hideDuration: 1000,
              showDuration: 1000  
            },
        legend : {
            navigation: {
                animation: 'true'
            },
            title: {
                style:{ 
                    fontWeight: 'bold',
                },
                text: ''
            }
        },
        tooltip: {
            animation: 'true'
        },
        credits: {
            enabled: false
        },
        plotOptions : {
            column : {
                animation: {
                    duration: 500
                },
                borderWidth: 0,

            },
        	series : {
                stacking : 'normal',
                cursor : 'pointer',
        		point : {
                    events : {
            			click: function(event) {
                            App.chart.showDrilldownPopup(this, event);
                        }
                    }
        		},
                
        	}
        },
        series : App.model.data.series
	},

	// Rendert das Balkendiagramm in div#chart 
	render : function() {
        // Wenn nur eine Series dann blende Legende aus
        this.config.legend.enabled = (App.model.data.series.length != 1);
        this.config.xAxis.categories = App.model.data.categories;
        this.config.series = App.model.data.series;
        this.config.title.text = App.model.data.title;
        $('#chart').highcharts(this.config);
    },

    update : function() {
        var chart = $('#chart').highcharts();
        var newData = App.model.data;
        
        //add all categories from new data to allCategories
        var allCategories = newData.categories.slice(0,newData.length);

        //add also all categories currently available and not already contained
        for (var i = 0; i < chart.xAxis[0].categories.length; i++) {
            if(allCategories.indexOf(chart.xAxis[0].categories[i]) == -1){
                allCategories.push(chart.xAxis[0].categories[i]);
            }
        }

        //now sort the categories to get better output
        allCategories = allCategories.sort();

        //update xAxis with allCategories
        chart.xAxis[0].setCategories(allCategories,false);

        var newSeries = newData.series;

        //create a hash that can access all old series by name
        //also create a list of all old series that will contain
        //the series that were not yet updated
        var oldSeriesH = {};
        var seriesReminder = [];
        for (var i = 0; i < chart.series.length; i++) {
            oldSeriesH[chart.series[i].name] = chart.series[i];
            seriesReminder.push(chart.series[i].name);
        }

        //now go through all new series and update their corresponding old
        //series or create a new one
        for (var newSeriesI = 0; newSeriesI < newSeries.length; newSeriesI++) {

            //first add possibly missing 0 values for categories that have no
            //entry in the series. Also put the other values into their correct position.
            var seriesData = [];
            for (var categoryI = 0; categoryI < allCategories.length; categoryI++) {
                var categoryS = allCategories[categoryI];
                var newIndex = App.model.data.categories.indexOf(categoryS);

                var newValue = 0;

                //only overwrite newValue if we have a value for this category
                if(newIndex != -1){
                    //newIndex is the category's index in the new dataset
                    newValue = newSeries[newSeriesI].data[newIndex];
                }
                //categoryI is the desired new position of the category
                seriesData[categoryI] = newValue;
            };
            //now overwrite data with fixed array
            newSeries[newSeriesI].data = seriesData;

            //if not in oldSeriesH, its new, create it
            if(oldSeriesH[newSeries[newSeriesI].name] == undefined){
                
                //create new series and append it to hash for later use
                oldSeriesH[newSeries[newSeriesI].name] = chart.addSeries(newSeries[newSeriesI],false);
            }
            //else it was already there, update it
            else{
                oldSeriesH[newSeries[newSeriesI].name].setData(seriesData,false);

                //indicate that it was updated, by removing it from seriesReminder
                seriesReminder.splice(seriesReminder.indexOf(newSeries[newSeriesI].name),1);
            }
        }

        //update model's data object
        newData.categories = allCategories;

        //update left series, if necessary
        if(seriesReminder.length > 0){
            //generate an array consisting of enough zeros
            var zeros = [];
            for(var k=0;k<allCategories.length;k++){
                zeros[k] = 0;
            }

            //which of the old ones where not updated? Set their values to 0
            for (var i = 0; i < seriesReminder.length; i++) {
                oldSeriesH[seriesReminder[i]].setData(zeros,false);

                //add them to app data, to keep it up to date
                newSeries.push({"name":seriesReminder[i],"data":zeros});
            }
        }
        //at this point, contents of appdata and chartdata should be equivalent!
        //only series order may differ.

        //look if we have to shorten the stuff
        if(newData.categories.length > 20){

            //get size of each category
            var catSizes = [];
            for(var categoryI = 0; categoryI < newData.categories.length; categoryI++){
                var catInfo = {
                    "indexApp": categoryI,
                    "name"    : newData.categories[categoryI],
                    "sum"     : 0
                }
                for(var seriesI = 0; seriesI < newSeries.length; seriesI++){
                    catInfo.sum += newSeries[seriesI].data[categoryI];
                }
                catSizes.push(catInfo);
            }
            //sort those sizes descending
            catSizes.sort(function(a, b){return b.sum - a.sum;});

            //look if there is already "Sonstige" in the data
            if( newData.categories.indexOf("Sonstige") != -1){
                var sonstIndex = -1;
                var sonstInfo = undefined;

                //if so, look where it is (if it comes after 18, we don't care)
                for(var i = 0; i < 19; i++){
                    if(catSizes[i].name === "Sonstige"){
                        sonstIndex = i;
                        sonstInfo = catSizes[i];
                    }
                }
                //if it was not among the first 19 entries, we don't care, as it will be put into the sum anyway
                if(sonstIndex != -1){
                    //otherwise let the others between move one to the left so that the order stays the same
                    for(var i = sonstIndex; i < 19; i++){
                        catSizes[i] = catSizes[i+1];
                    }
                    //put "Sonstige" to index 19
                    catSizes[19] = sonstInfo;
                }
            }
            //for each series
            for(var seriesI = 0; seriesI < newSeries.length; seriesI++){
                var seriesData = [];
                //resort all seriesData by placing them according to catSizes
                for(var catIndex = 0; catIndex < 19; catIndex++){
                    seriesData[catIndex] = newSeries[seriesI].data[catSizes[catIndex].indexApp];
                    
                }
                seriesData[19] = 0;
                //sum up all categories after index 18 and put the sum into index 19
                for(var catIndex = 19; catIndex < catSizes.length; catIndex++){
                    seriesData[19] += newSeries[seriesI].data[catSizes[catIndex].indexApp];
                }
                //update model series
                newSeries[seriesI].data = seriesData;
                //update chart series
                oldSeriesH[newSeries[seriesI].name].setData(seriesData,false);
            }

            //update categories analogue to series
            var newCategories = [];
            for(var catIndex = 0; catIndex < 19; catIndex++){
                newCategories[catIndex] = catSizes[catIndex].name;
            }
            newCategories[19] = "Sonstige";
            newData.categories = newCategories;
            chart.xAxis[0].setCategories(newCategories,false);
        }
        chart.redraw();
    }
};
