/**
 * Node module dependencies
 * @type {*|exports|module.exports}
 */
var _ = require('lodash');

/**
 * MapManager class - Loads all assets from a configuration file
 * @param game
 * @constructor
 */
var MapManager = function(game) {

  /**
   * Stores PhaserJS Game Instance
   * @type Phaser
   */
  this.game = game;

  /**
   * Uses configuration file for maps
   * @type {maps}
   */
  this.config = this.game.ao.config.get('maps');

  /**
   * Instantiates storage for maps into this manager
   * @type {MemoryMapStorage}
   */
  this.storage = this.game.ao.add.storage('map', this.config.storage);

  /**
   * Instantiates loader for maps into this manager
   * @type {BinaryMapLoader}
   */
  this.loader = this.game.ao.add.loader('map', this.config.loader, this.storage, this.config.path);

};

/**
 * Loads a given map using a given map id {map}
 * @param map - Integer identifier of the map to load
 * @param cb - Listener for when a map is loaded into memory
 * @returns {MapManager}
 */
MapManager.prototype.load = function(map, cb) {
  try {
    if(this.storage.has(map)) {
      console.info('[managers/MapManager.js]: Restoring previously ' +
        'loaded map from cache: [' + map.number + ']');

      return cb(this.storage.get(map));
    }

    this.loader.addListener('onLoaded', cb);
    this.loader.load(map, function(map) {
      console.info('[managers/MapManager.js]: Successfully loaded map with ID [' + map.number + ']');
    });
  } catch(err) {
    console.error('[managers/MapManager.js]: Map with ID [' + map + '] failed to load: ' + err.message);
  }

  return this;
};

/**
 * Export this module definition
 * @type {Function}
 */
module.exports = MapManager;