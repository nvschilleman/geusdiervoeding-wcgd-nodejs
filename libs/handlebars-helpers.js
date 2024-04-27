console.log('HelpersFile Loaded');
var register = function(Handlebars) {
    var helpers = {
      compare: function (variableOne, comparator, variableTwo) {
        if (eval(variableOne + comparator + variableTwo)) {
          return true
        } else {
          return false
        }
      },
      ifeq: function (a, b, options) {
        if (a == b) { return options.fn(this); }
        return options.inverse(this);
      },
      ifnoteq: function (a, b, options) {
        if (a != b) { return options.fn(this); }
        return options.inverse(this);
      }

    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  module.exports.register = register;
  module.exports.helpers = register(null);  



