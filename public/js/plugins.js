// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


/**
 * jQuery plugin to store/restore form-state as an object.
 *
 * This does not deal with encoding/decoding in JSON or any
 * other data-format, nor does it deal with storage-media.
 *
 * Minifies to < 1KB.
 *
 * To obtain the state of form elements:
 * 
 *   var state = $('form').formstate();
 *
 * To obtain the state of certain form elements:
 *
 *   var state = $('form').formstate(':visible');
 *
 * To restore state to form elements:
 *
 *   $('form').formstate(state);
 *
 * To restore state to certain form elements:
 *
 *   $('form :input:visible').formstate(state);
 *
 * @author Rasmus Schultz <http://blog.mindplay.dk>
 */
(function($) {

    var
        excluded_type = ':button,:submit,:reset,:password',
        input_types = 'input,select,textarea';
    
    function get_state($inputs) {
        var data = {};
        
        $inputs.each(function() {
            var $input = $(this);
            
            if ($input.is(excluded_type)) {
                return;
            }
            
            if ($input.is(':checkbox')) {
                var list = data[$input.attr('name')] || [],
                    value = $input.attr('value');
                if ($input.prop('checked')) {
                    list.push(value);
                }
                data[$input.attr('name')] = list;
            } else if ($input.is(':radio')) {
                if ($input.prop('checked')) {
                    data[$input.attr('name')] = $input.attr('value');
                }
            } else {
                data[$input.attr('name')] = $input.val();
            }
        });
        
        return data;
    }
    
    function set_state($inputs, data) {
        $inputs.each(function() {
            var $input = $(this);
            
            if ($input.is(excluded_type)) {
                return;
            }
            
            if ($input.is(':checkbox')) {
                $input.prop('checked', (data[$input.attr('name')] || []).indexOf($input.attr('value'))!=-1);
            } else if ($input.is(':radio')) {
                $input.prop('checked', data[$input.attr('name')] === $input.attr('value'));
            } else {
                $input.val(data[ $input.attr('name') ]);
            }
        });
    }
    
    $.fn.formstate = function(a) {
        var $inputs = (this.is('form') ? this.find(input_types) : this.filter(input_types))
            .filter('[name]');
        
        if (!a) {
            return get_state($inputs);
        } else if ($.type(a) === 'string') {
            return get_state($inputs.filter(a));
        } else {
            set_state($inputs, a);
        }
        
        return this;
    };

})(jQuery);

/**
 * jQuery JSON plugin 2.4.0
 *
 * @author Brantley Harris, 2009-2011
 * @author Timo Tijhof, 2011-2012
 * @source This plugin is heavily influenced by MochiKit's serializeJSON, which is
 *         copyrighted 2005 by Bob Ippolito.
 * @source Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 *         website's http://www.json.org/json2.js, which proclaims:
 *         "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 *         I uphold.
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function ($) {
    'use strict';

    var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        hasOwn = Object.prototype.hasOwnProperty;

    /**
     * jQuery.toJSON
     * Converts the given argument into a JSON representation.
     *
     * @param o {Mixed} The json-serializable *thing* to be converted
     *
     * If an object has a toJSON prototype, that will be used to get the representation.
     * Non-integer/string keys are skipped in the object, as are keys that point to a
     * function.
     *
     */
    $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
        if (o === null) {
            return 'null';
        }

        var pairs, k, name, val,
            type = $.type(o);

        if (type === 'undefined') {
            return undefined;
        }

        // Also covers instantiated Number and Boolean objects,
        // which are typeof 'object' but thanks to $.type, we
        // catch them here. I don't know whether it is right
        // or wrong that instantiated primitives are not
        // exported to JSON as an {"object":..}.
        // We choose this path because that's what the browsers did.
        if (type === 'number' || type === 'boolean') {
            return String(o);
        }
        if (type === 'string') {
            return $.quoteString(o);
        }
        if (typeof o.toJSON === 'function') {
            return $.toJSON(o.toJSON());
        }
        if (type === 'date') {
            var month = o.getUTCMonth() + 1,
                day = o.getUTCDate(),
                year = o.getUTCFullYear(),
                hours = o.getUTCHours(),
                minutes = o.getUTCMinutes(),
                seconds = o.getUTCSeconds(),
                milli = o.getUTCMilliseconds();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            if (milli < 100) {
                milli = '0' + milli;
            }
            if (milli < 10) {
                milli = '0' + milli;
            }
            return '"' + year + '-' + month + '-' + day + 'T' +
                hours + ':' + minutes + ':' + seconds +
                '.' + milli + 'Z"';
        }

        pairs = [];

        if ($.isArray(o)) {
            for (k = 0; k < o.length; k++) {
                pairs.push($.toJSON(o[k]) || 'null');
            }
            return '[' + pairs.join(',') + ']';
        }

        // Any other object (plain object, RegExp, ..)
        // Need to do typeof instead of $.type, because we also
        // want to catch non-plain objects.
        if (typeof o === 'object') {
            for (k in o) {
                // Only include own properties,
                // Filter out inherited prototypes
                if (hasOwn.call(o, k)) {
                    // Keys must be numerical or string. Skip others
                    type = typeof k;
                    if (type === 'number') {
                        name = '"' + k + '"';
                    } else if (type === 'string') {
                        name = $.quoteString(k);
                    } else {
                        continue;
                    }
                    type = typeof o[k];

                    // Invalid values like these return undefined
                    // from toJSON, however those object members
                    // shouldn't be included in the JSON string at all.
                    if (type !== 'function' && type !== 'undefined') {
                        val = $.toJSON(o[k]);
                        pairs.push(name + ':' + val);
                    }
                }
            }
            return '{' + pairs.join(',') + '}';
        }
    };

    /**
     * jQuery.evalJSON
     * Evaluates a given json string.
     *
     * @param str {String}
     */
    $.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
        /*jshint evil: true */
        return eval('(' + str + ')');
    };

    /**
     * jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     *
     * @param str {String}
     */
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
        var filtered =
            str
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, '');

        if (/^[\],:{}\s]*$/.test(filtered)) {
            /*jshint evil: true */
            return eval('(' + str + ')');
        }
        throw new SyntaxError('Error parsing JSON, source is not valid.');
    };

    /**
     * jQuery.quoteString
     * Returns a string-repr of a string, escaping quotes intelligently.
     * Mostly a support function for toJSON.
     * Examples:
     * >>> jQuery.quoteString('apple')
     * "apple"
     *
     * >>> jQuery.quoteString('"Where are we going?", she asked.')
     * "\"Where are we going?\", she asked."
     */
    $.quoteString = function (str) {
        if (str.match(escape)) {
            return '"' + str.replace(escape, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + str + '"';
    };

}(jQuery));

/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */

/*

Basic Usage:
============

$('#el').spin(); // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }); // Creates a Spinner using the provided options.

$('#el').spin(false); // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small'); // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff'); // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines: 9
  length: 10
  width: 20
  radius: 0
}

$('#el').spin('flower', 'red');

*/

(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'))
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  }
  else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        )
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));

/*!
 * jqtimeline Plugin
 * http://goto.io/jqtimeline
 *
 * Copyright 2013 goto.io
 * Released under the MIT license
 *
 */
;
(function($) {
    var pluginName = 'jqTimeline',
        defaults = {
            startYear : (new Date()).getFullYear() -1 , // Start with one less year by default
            numYears : 3,
            gap : 25, // gap between lines
            showToolTip : true,
            groupEventWithinPx : 6, // Will show common tooltip for events within this range of px
            events : [],
            click : null //Handler for click event for event
        },
    aMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function jqTimeLine(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$el = $(element);
        this._defaults = defaults;
        this._name = pluginName;
        this._offset_x = 14; // Starting position of the line
        this._current_offset_x = 14; // var used for laying out months to the hor line
        this._gap = this.options.gap; 
        this._eDotWidth = 16; // Width of the event dot shown in the ui
        this._$toolTip = null; // use to have reference of the tooltip
        this._a$Events = []; // will store all jquery elements of events, marked on the timeline
        this._aEvents = []; //array of events obj {id,name,on}
        this._counter = 0 ; // Use to generate id for events without ids
        this.$mainContainer;
        this._year_gap = 1;
        this._numLines = this.options.numYears / this._year_gap;
        this.init();
    }

    jqTimeLine.prototype.init = function() {
        _this = this;
        this._generateMarkup();
        //Attach a event handler to global container
        if(_this.options.click){
            _this.$mainContainer.on('click',function(e){
                var $t = $(e.target);
                if($t.hasClass('event') || $t.hasClass('msg')){
                    //In both the cases eventId is stored in the format msg_eventid or event_eventid
                    var eventId = $t.attr('id').split("_")[1];
                    _this.options.click(e,_this._aEvents[eventId]);
                }
                if($t.hasClass('closeTooltip')){
                    //we may need to close the tooltip
                    var eventId = $t.attr('id').split("_")[1];
                    var $tgt = $('#'+eventId);
                    _this._addEventListner($tgt,'mouseleave');
                    var $tooltipEl = $('#tooltip_' + eventId);
                    $tooltipEl.remove();
                }
            });
        }
    };

    jqTimeLine.prototype._generateMarkup = function() {
        var _this = this;
        var i = 0,j=0;
        //var totalWidth = _this.options.numYears * this._gap * 12 + 3;
        var totalWidth = _this.$el.width();
        var containerWidth = totalWidth;// + 30;
        var $mainContainer = this.$mainContainer = $(
            '<div class="gt-timeline" style="width:'+containerWidth+'px">' + 
                '<div class="main_line" style="width:'+(totalWidth+2)+'px"></div>' + 
            '</div>'
        );

        _this._gap = containerWidth / (this._numLines*2);
        for(j=0;j<_this.options.numYears;j += this._year_gap){
            $mainContainer.append(_this._getMonthMarkup(true, _this.options.startYear + j));
            $mainContainer.append(_this._getMonthMarkup(false, _this.options.startYear + j));
        }
        $mainContainer.append(_this._getMonthMarkup(true, _this.options.startYear + _this.options.numYears));
        //Start adding events
        for(var k=0;k<_this.options.events.length;k++){
            var e = _this.options.events[k];
            var d = e.on;
            if(d.getFullYear() >= _this.options.startYear && d.getFullYear() < _this.options.startYear + _this.options.numYears){
                $mainContainer.append(_this._getEventMarkup(e));
            }
        }
        _this.$el.prepend($mainContainer);
    };

    jqTimeLine.prototype._getMonthMarkup = function(semester, year){
        var _this = this;
        var retStr = "";
        if (semester) {
            retStr = '<div class="horizontal-line month-line even-month" style="left:'+_this._current_offset_x+'px"><div class="month">WS'+year+'</div></div>';
        } else {
            retStr = '<div class="horizontal-line month-line odd-month" style="left:'+_this._current_offset_x+'px"><div class="month">SS</div></div>';
            
        }
        _this._current_offset_x += _this._gap;
        return retStr;
    }

    jqTimeLine.prototype._getGenId = function(){
        var _this = this;
        while(_this._counter in this._aEvents){
            _this._counter ++;
        }
        return _this._counter;
    }

    jqTimeLine.prototype._showToolTip=function(nLeft,strToolTip,eventId,closable){
        var _this = this;
        _this._$toolTip  = $(
                                '<div class="e-message" id="tooltip_'+eventId+'" style="left:'+ nLeft +'px">' +
                                    '<div class="message-pointer"></div>' +
                                    strToolTip + 
                                '</div>'
                            );
        _this.$mainContainer.append(_this._$toolTip);
    }

    jqTimeLine.prototype._getAllNeighborEvents = function(nLeft){
        var _this = this;
        //Get all event within 10 px range. Group all event within 
        var neighborEvents = $('.event',_this.$mainContainer).filter(function(){
            var nCurrentElLeftVal = parseInt($(this).css('left'));
            return (nCurrentElLeftVal <= nLeft +  _this.options.groupEventWithinPx) && (nCurrentElLeftVal >= nLeft -  _this.options.groupEventWithinPx);
        });
        return neighborEvents;
    }



    jqTimeLine.prototype._getEventMarkup = function(e){
        var _this = this;
        //Attach id if not there
        if(typeof e.id === 'undefined') e.id = _this._getGenId();
        _this._aEvents[e.id] = e; //Add event to event array
        var eName = e.name;
        var d = e.on;
        var n = d.getDate();
        var yn = d.getFullYear() - _this.options.startYear;
        var mn = d.getMonth();
        var totalMonths = (yn * 12) + mn;
        var leftVal = Math.ceil(_this._offset_x + totalMonths * _this.options.gap + (_this.options.gap/31)*n - _this._eDotWidth/2);
        var $retHtml = $('<div class="event" id="event_'+e.id+'" style="left:'+leftVal+'px">&nbsp;</div>').data('event',e);
        $retHtml.data('eventInfo',_this._aEvents[e.id]);
        if(_this.options.click){
            _this._addEventListner($retHtml,'click');
        }
        if(_this.options.showToolTip){
            _this._addEventListner($retHtml,'mouseover');
            _this._addEventListner($retHtml,'mouseleave');
        }
        _this._a$Events[e.id] = $retHtml;
        return $retHtml;
    }

    jqTimeLine.prototype._addEventListner = function($retHtml,sEvent){
        var _this = this;
        if(sEvent == 'mouseover'){
            $retHtml.mouseover( 
                function(e){
                    var $t = $(e.target);
                    var nLeft = parseInt($t.css('left'));
                    var eObj = $t.data('event');
                    if(_this._$toolTip){
                        if(_this._$toolTip.data('state') && _this._$toolTip.data('state') === 'static'){
                            var eventId = _this._$toolTip.data('eventId');
                            var $tgt = $('#'+eventId);
                            // _this._addEventListner($tgt,'mouseover');
                            _this._addEventListner($tgt,'mouseleave');
                            _this._$toolTip.data('state','dynamic');
                        }
                        _this._$toolTip.remove();
                    } 

                    var neighborEvents = _this._getAllNeighborEvents(nLeft);
                    var strToolTip = "" ;
                    for (var i = 0; i < neighborEvents.length; i++) {
                        var $temp = $(neighborEvents[i]);
                        var oData = $temp.data('event');
                        strToolTip = strToolTip + '<div class="msg" id="msg_'+oData.id+'">'+oData.on.toDateString()+' : '+ oData.name +'</div>';
                    };
                    _this._showToolTip(nLeft,strToolTip,eObj.id,false);
                }
            );
        }
        if(sEvent == 'mouseleave'){
            $retHtml.mouseleave(function(e){
                var $targetObj = $(this);
                var eventId = $targetObj.data('event').id;
                var $tooltipEl = $('#tooltip_' + eventId);
                e.stopImmediatePropagation();
                var fixed = setTimeout(function(){
                    $tooltipEl.remove();
                }, 500);
                $tooltipEl.hover(
                    function(){clearTimeout (fixed);},
                    function(){$tooltipEl.remove();}
                );
            });
        }
        if(sEvent == 'click'){
        // Attach a click event handler to event objects
            $retHtml.click(function(e){
                var $targetObj = $(this);
                var eventId = $targetObj.data('event').id;
                var $tooltipEl = $('#tooltip_' + eventId);
                var $msgs = $('.msg',$tooltipEl);
                if($msgs.length == 1){
                    // Do not stop the propogation .. let the parent handles the click event
                    //_this.options.click();
                }else if($msgs.length > 1){
                    // If the tooltip has more than one message make it non-dynamic
                    e.stopPropagation(); // Stop the propogation so that the parent wont get notified
                    var markup =    $('<div class="info">' + 
                                        '<div>Select one even from below : </div>' + 
                                        '<div class="icon-close closeTooltip" id="eCloseButton_'+eventId+'"></div>' + 
                                    '</div>');
                    $tooltipEl.prepend(markup);
                    // $retHtml.off('mouseover');
                    $retHtml.off('mouseleave');
                    $tooltipEl.data('state','static');
                    $tooltipEl.data('eventId',eventId);
                }
            });
        }   
    }


    var isArray = function(a){
        return Object.prototype.toString.apply(a) === '[object Array]';
    }

    // public methods start from here 
    jqTimeLine.prototype.addEvent = function(e){
        var arr = [],i=0;
        arr = $.isArray(e) ? e : [e];
        for(i=0;i<arr.length;i++){
            var markup = this._getEventMarkup(arr[i]);
            this.$mainContainer.append(markup);
        }
    }

    jqTimeLine.prototype.deleteEvent = function(eIds){
        var _this = this;
        if(typeof eIds === 'undefined') return;
        var arr = [],i;
        if(typeof eIds === "number" || typeof eIds === "string"){
            arr = [eIds]; // ids can be string too
        }else if (isArray(eIds)){
            arr = eIds; // This can be array of objects 
        }else{
            arr = [eIds];// This can be object itself
        }
        for(i=0; i < arr.length;i++){
            var key = arr[i]; // This can be a event object itself
            if(typeof key === 'object'){
                if(typeof key.id === 'undefined') continue;
                else key = key.id;
            }
            var $obj = _this._a$Events[key];
            if(typeof $obj === 'undefined') continue;
            $obj.remove();
            delete _this._a$Events[key];
            delete _this._aEvents[key]; 
        }
    }

    jqTimeLine.prototype.getAllEvents = function(){
        var _this = this;
        var retArr = [];
        for(key in _this._aEvents){
            retArr.push(_this._aEvents[key])
        }
        return retArr;
    }

    jqTimeLine.prototype.getAllEventsElements = function(){
        var _this = this;
        var retArr = [];
        for(key in _this._a$Events){
            retArr.push(_this._a$Events[key])
        }
        return this._a$Events;
    }

    $.fn.jqtimeline = function(options) {
        return this.each(function() {
            var element = $(this);
            if(element.data('timeline')) return;
            var timeline = new jqTimeLine(this, options);
            element.data('jqtimeline', timeline);
        });
    };

}(jQuery, window));