/**
 * Module dependencies
 * @type {*|exports|module.exports}
 * @private
 */
var Tile = require('./Tile.js')
  , _ = require('lodash');

/**
 * Map Class - Model for maps
 * @param id
 * @constructor
 */
var Map = function(game, id) {

  /**
   * Saves current game instance reference into model
   * @type {Phaser}
   */
  this.game = game;

  /**
   * Unique identifier for this map
   * @type {number}
   */
  this._id = id;

  /**
   * Saves map number into internal structure
   * @type {number}
   */
  this.number = id;

  /**
   * Array of tiles contained in this map
   * @type {{}}
   */
  this.tiles = [];

  /**
   * Initialize self-instance of loader
   *
   * @type {Map.BufferLoader}
   */
  this.loader = new Map.BufferLoader(game, this);

};

/**
 * Constant map width in tiles
 * @type {number}
 */
Map.prototype.MAP_TILE_WIDTH = 100;

/**
 * Constant map height in tiles
 * @type {number}
 */
Map.prototype.MAP_TILE_HEIGHT = 100;

/**
 * Map harcoded header size in bytes
 * @type {number}
 */
Map.prototype.HEADER_SIZE = 263 + (2 * 5);

/**
 * Obtains a position in the internal array buffer of tiles
 * given some an x and y coordinates
 * @param x
 * @param y
 * @returns {*}
 */
Map.prototype.getTilePosition = function(x, y) {
  return (y * this.MAP_TILE_WIDTH) + x;
};

/**
 * Map.BufferLoader Class - Exports a buffer loader class
 * in use to load binary map data into memory
 * @param map
 * @constructor
 */
Map.BufferLoader = function(game, map) {

  /**
   * Saves game instance into this BufferLoader object
   * @type {Phaser.Game}
   */
  this.game = game;

  /**
   * Internally save the map instance for edition
   * @type {Map}
   */
  this.map = map;

};

/**
 * Loads an entire map data into memory from a binary
 * BufferAdapter reader object
 * @param {BufferAdapter} reader
 */
Map.BufferLoader.prototype.load = function(reader, game) {
  reader.skipBytes(this.map.HEADER_SIZE);

  for(var x = 0; x < this.map.MAP_TILE_WIDTH; x++) {
    for(var y = 0; y < this.map.MAP_TILE_HEIGHT; y++) {
      var tile = new Tile()
        , data = reader.getNextByte();

      tile.blocked = (1 == (data & 1));
      tile.graphics[0] = reader.getNextInt16();
      if((data & 2) == 2) tile.graphics[1] = reader.getNextInt16();
      if((data & 4) == 4) tile.graphics[2] = reader.getNextInt16();
      if((data & 8) == 8) tile.graphics[3] = reader.getNextInt16();
      if((data & 16) == 16) tile.trigger = reader.getNextInt16();

      tile.load(game);
      this.map.tiles.splice(this.map.getTilePosition(x, y), 0, tile);
    }
  }
};

/**
 * Export this object's constructor
 * @type {Function}
 */
module.exports = Map;