/**
 * Module dependencies
 * @type {configuration|exports|module.exports}
 */
var config = require('../config/maps.js')
  , EventManager = require('../managers/EventManager.js')
  , BufferAdapter = require('../adapters/BufferAdapter.js')
  , Map = require('../models/Map.js')
  , _ = require('lodash');

/**
 * Constructor for game Map Data Loader
 * @param game
 * @param id
 * @param storage
 * @param path
 * @constructor
 */
var BinaryMapLoader = function BinaryMapLoader(game, storage, path) {
  var config = require('../config/maps.js');
  this.game = game;
  this._path = path || config.path;
  this._storage = storage;
  this.config = config;
  EventManager.eventify(this);
};

/**
 * Generates a map filename using value of format in
 * maps configuration file and appending the result
 * to the previously loaded path string
 * @param mapId
 * @returns {string}
 */
BinaryMapLoader.prototype.getMapPath = function(mapId) {
  return this._path + this.config.format.replace(/\{number}/, mapId.toString());
};

/**
 * Performs the load of all maps binary files
 * @param onLoadCallback
 * @returns {*|Phaser.Loader|{}}
 */
BinaryMapLoader.prototype.load = function(map, onLoaded) {
  this.addListener('onLoaded', this.onLoaded);
  this.addListener('onLoaded', onLoaded);

  return this.game.load.binary('map' + map, this.getMapPath(map), this.process, this);
};

/**
 * Processes the loaded data object
 * @param key
 * @param data
 * @returns {*}
 */
BinaryMapLoader.prototype.process = function(key, buffer) {
  var reader = new BufferAdapter(buffer, true);

  var map = new this.config.model(key);
  map.loader.load(reader);

  this.fire('onLoaded', [map], this);
  return buffer;
};

/**
 * Callback for loaded maps
 * @param map
 */
BinaryMapLoader.prototype.onLoaded = function(map) {
  this._storage.add(map.id, map);
};

/**
 * Exports object constructor
 * type {Function}
 */
module.exports = BinaryMapLoader;