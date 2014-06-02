function noop(){}

function id(x){return x}

function own(obj, prop){
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function toArray(arrayLike){
  if (isArray(arrayLike)) {
    return arrayLike;
  } else {
    return Array.prototype.slice.call(arrayLike);
  }
}

function createObj(proto) {
  var F = function(){};
  F.prototype = proto;
  return new F();
}

function extend() {
  if (arguments.length === 1) {
    return arguments[0];
  }
  var result = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]) {
      if(own(arguments[i], prop)) {
        result[prop] = arguments[i][prop];
      }
    }
  }
  return result;
}

function inherit(Child, Parent/*[, mixin1, mixin2, ...]*/) {
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (var i = 2; i < arguments.length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}

function inheritMixin(Child, Parent) {
  for (var prop in Parent) {
    if (own(Parent, prop) && !(prop in Child)) {
      Child[prop] = Parent[prop];
    }
  }
  return Child;
}

function firstArrOrToArr(args) {
  if (isArray(args[0])) {
    return args[0];
  }
  return toArray(args);
}

function restArgs(args, start, nullOnEmpty){
  if (args.length > start) {
    return Array.prototype.slice.call(args, start);
  }
  if (nullOnEmpty) {
    return null;
  } else {
    return [];
  }
}

function getFn(fn, context) {
  if (isFn(fn)) {
    return fn;
  } else {
    /*jshint eqnull:true */
    if (context == null || !isFn(context[fn])) {
      throw new Error('not a function: ' + fn + ' in ' + context);
    } else {
      return context[fn];
    }
  }
}

function callFn(fnMeta, moreArgs){
  // fnMeta = [
  //   fn,
  //   context,
  //   arg1,
  //   arg2,
  //   ...
  // ]
  var fn, context, args;
  if (isFn(fnMeta)) {
    fn = fnMeta;
    context = null;
    args = null;
  } else {
    context = fnMeta[1];
    fn = getFn(fnMeta[0], context);
    args = restArgs(fnMeta, 2, true);
  }
  if (moreArgs){
    if (args) {
      args = args.concat(toArray(moreArgs));
    } else {
      args = moreArgs;
    }
  }
  /*jshint eqnull:true */
  if (context == null) {
    if (!args || args.length === 0) {
      return fn();
    } else if (args.length === 1) {
      return fn(args[0]);
    } else if (args.length === 2) {
      return fn(args[0], args[1]);
    } else if (args.length === 3) {
      return fn(args[0], args[1], args[2]);
    }
  }
  return args ? fn.apply(context, args) : fn.call(context);
}

function normFnMeta(fnMeta) {
  if (isArray(fnMeta) || isArguments(fnMeta)) {
    if (fnMeta.length === 1) {
      return fnMeta[0];
    }
    if (fnMeta.length === 0) {
      return null;
    }
  }
  return fnMeta;
}

function isFn(fn) {
  return typeof fn === 'function';
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function isArray(xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
}

var isArguments = function(xs) {
  return Object.prototype.toString.call(xs) === '[object Arguments]';
}

// For IE
if (!isArguments(arguments)) {
  isArguments = function(obj) {
    return !!(obj && own(obj, 'callee'));
  }
}

function isEqualArrays(a, b) {
  /*jshint eqnull:true */
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };

function get(map, key, notFound){
  if (map && key in map) {
    return map[key];
  } else {
    return notFound;
  }
}
