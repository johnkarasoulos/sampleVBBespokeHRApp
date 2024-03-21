define([], function () {
  'use strict';

  var AppModule = function AppModule() {};

  /**
   *
   * @param {String} arg1
   * @return {String}
   */
  AppModule.prototype.setName = function (arg1) {
    console.log("the user of the application is: "+arg1);
    window.apmrum.username = arg1;
    console.log("the APM user is: "+window.apmrum.username);
  };
 

  return AppModule;
});
