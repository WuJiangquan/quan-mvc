
define([],function(){
	 // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	 // IE 11 (#1621), and in Safari 8 (#1929).
	 var _ = {};
	 if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	   _.isFunction = function(obj) {
	     return typeof obj == 'function' || false;
	   };
	 }
	 
	 var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	 // Create quick reference variables for speed access to core prototypes.
	 var
	   push             = ArrayProto.push,
	   slice            = ArrayProto.slice,
	   toString         = ObjProto.toString,
	   hasOwnProperty   = ObjProto.hasOwnProperty;

	 // All **ECMAScript 5** native function implementations that we hope to use
	 // are declared here.
	 var
	   nativeIsArray      = Array.isArray,
	   nativeKeys         = Object.keys,
	   nativeBind         = FuncProto.bind,
	   nativeCreate       = Object.create;

	 
	 
	 // By default, Underscore uses ERB-style template delimiters, change the
	 // following template settings to use alternative delimiters.
	 _.templateSettings = {
	   evaluate    : /<%([\s\S]+?)%>/g,
	   interpolate : /<%=([\s\S]+?)%>/g,
	   escape      : /<%-([\s\S]+?)%>/g
	 };

	 // When customizing `templateSettings`, if you don't want to define an
	 // interpolation, evaluation or escaping regex, we need one that is
	 // guaranteed not to match.
	 var noMatch = /(.)^/;

	//Certain characters need to be escaped so that they can be put into a
	 // string literal.
	 var escapes = {
	   "'":      "'",
	   '\\':     '\\',
	   '\r':     'r',
	   '\n':     'n',
	   '\u2028': 'u2028',
	   '\u2029': 'u2029'
	 };


	 var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	 var escapeChar = function(match) {
	   return '\\' + escapes[match];
	 };
	 


	 // Internal function that returns an efficient (for current engines) version
	 // of the passed-in callback, to be repeatedly applied in other Underscore
	 // functions.
	 var optimizeCb = function(func, context, argCount) {
	   if (context === void 0) return func;
	   switch (argCount == null ? 3 : argCount) {
	     case 1: return function(value) {
	       return func.call(context, value);
	     };
	     case 2: return function(value, other) {
	       return func.call(context, value, other);
	     };
	     case 3: return function(value, index, collection) {
	       return func.call(context, value, index, collection);
	     };
	     case 4: return function(accumulator, value, index, collection) {
	       return func.call(context, accumulator, value, index, collection);
	     };
	   }
	   return function() {
	     return func.apply(context, arguments);
	   };
	 };

	 // The cornerstone, an `each` implementation, aka `forEach`.
	 // Handles raw objects in addition to array-likes. Treats all
	 // sparse array-likes as if they were dense.
	 _.each = _.forEach = function(obj, iteratee, context) {
	   iteratee = optimizeCb(iteratee, context);
	   var i, length;
	   if (isArrayLike(obj)) {
	     for (i = 0, length = obj.length; i < length; i++) {
	       iteratee(obj[i], i, obj);
	     }
	   } else {
	     var keys = _.keys(obj);
	     for (i = 0, length = keys.length; i < length; i++) {
	       iteratee(obj[keys[i]], keys[i], obj);
	     }
	   }
	   return obj;
	 };

	 
	 // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	 
	//Shortcut function for checking if an object has a given property directly
	 // on itself (in other words, not on a prototype).
	 _.has = function(obj, key) {
	   return obj != null && hasOwnProperty.call(obj, key);
	 };

	 // Is a given variable an object?
	 _.isObject = function(obj) {
	   var type = typeof obj;
	   return type === 'function' || type === 'object' && !!obj;
	 };
	 
	 var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	//Determine if the array or object contains a given item (using `===`).
	 // Aliased as `includes` and `include`.
	 _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	   if (!isArrayLike(obj)) obj = _.values(obj);
	   if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	   return _.indexOf(obj, item, fromIndex) >= 0;
	 };
	 
	 // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	 var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	 var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                     'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	 
	 function collectNonEnumProps(obj, keys) {
		    var nonEnumIdx = nonEnumerableProps.length;
		    var constructor = obj.constructor;
		    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

		    // Constructor is a special case.
		    var prop = 'constructor';
		    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

		    while (nonEnumIdx--) {
		      prop = nonEnumerableProps[nonEnumIdx];
		      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
		        keys.push(prop);
		      }
		    }
		  }
	//Retrieve all the property names of an object.
	 _.allKeys = function(obj) {
	   if (!_.isObject(obj)) return [];
	   var keys = [];
	   for (var key in obj) keys.push(key);
	   // Ahem, IE < 9.
	   if (hasEnumBug) collectNonEnumProps(obj, keys);
	   return keys;
	 };
	 //An internal function for creating assigner functions.
	 var createAssigner = function(keysFunc, undefinedOnly) {
	   return function(obj) {
	     var length = arguments.length;
	     if (length < 2 || obj == null) return obj;
	     for (var index = 1; index < length; index++) {
	       var source = arguments[index],
	           keys = keysFunc(source),
	           l = keys.length;
	       for (var i = 0; i < l; i++) {
	         var key = keys[i];
	         if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	       }
	     }
	     return obj;
	   };
	 };
	 
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	 
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };
	  return _;
})

