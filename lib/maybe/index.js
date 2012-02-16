var util = require('util');

function maybe(value) {
  var obj = null;
  function isEmpty() { return value === undefined || value === null }
  function nonEmpty() { return !isEmpty() }
  obj = {
    map: function (f) { return isEmpty() ? obj : maybe(f(value)) },
    getOrElse: function (n) { return isEmpty() ? n : value },
    get: function () { return value },
    isEmpty: isEmpty,
    nonEmpty: nonEmpty
  }
  return obj;
}

exports.maybe = maybe;

exports.when = function (x) {
  return function () {
    for (var i in arguments) {
      var result = arguments[i](x);
      if (result !== false) {
        return result;
      }
    }
    throw "No patterns matched when(" + util.inspect(x) + ")";
  };
}

exports.match = function (pattern) {
  return function (then) {
    return function (x) {
      var match = pattern === true ? true : pattern(x);
      return match !== false ? then(match) : false;
    }
  }
}

exports.some = function (f) {
  return function (x) { return x.nonEmpty() ? f(x.get()) : false };
}

exports.none = function (x) {
  return typeof x === "object" && typeof x.isEmpty === "function" && x.isEmpty();
};
