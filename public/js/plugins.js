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

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */ (function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) {}
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
            config.raw ? key : encodeURIComponent(key),
                '=',
            config.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, {
                expires: -1
            }));
            return true;
        }
        return false;
    };

}));
