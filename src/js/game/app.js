/**
 * Argentum Online JS - Game entry point:
 *
 *  This is the initial class of this game, it gets loaded
 *  on index.html and it's the entry point for all the states
 *  that are configured in 'config/states.js'
 */
(function() {

  /**
   * Declare needed game dependencies
   * @type {*}
   */
  var Argentum = require('./core/Argentum')
    , properties = require('./properties');

  /**
   * Start our game instance
   * @type {Argentum}
   */
  var ao = new Argentum(properties);

})();