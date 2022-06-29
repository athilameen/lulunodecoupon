var moment = require('moment');
moment().format();

var DateFormats = {
  short: "DD MMMM - YYYY",
  long: "DD/MM/YYYY HH:mm:A"
};

var register = function(Handlebars) {
    var helpers = {
      // put all of your helpers inside this object

      formatDate: function(datetime, format){
        if (moment) {
          // can use other formats like 'lll' too
          format = DateFormats[format] || format;
          return moment(datetime).format(format);
        } else {
          return datetime;
        }
      },

      ifEquals: function(arg1, arg2, options){
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },

      ifEqualLess: function(arg1, arg2, options){
        return (arg1 >= arg2) ? options.fn(this) : options.inverse(this);
      },

      ifEqualLessWithor: function(arg1, arg2, arg3, options){
        return (arg1 >= arg2 || arg3 != "") ? options.fn(this) : options.inverse(this);
      },

      addOne: function(value){
        return value + 1;
      },

      ifMatchString: function (arg1, arg2, options) {
        const arg1String = JSON.stringify(arg1);
        return (arg1String.match(arg2)) ? options.fn(this) : options.inverse(this);
      },

      foo: function(){
        return "foo";
      },

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