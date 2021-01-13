// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@turf/helpers/dist/es/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feature = feature;
exports.geometry = geometry;
exports.point = point;
exports.points = points;
exports.polygon = polygon;
exports.polygons = polygons;
exports.lineString = lineString;
exports.lineStrings = lineStrings;
exports.featureCollection = featureCollection;
exports.multiLineString = multiLineString;
exports.multiPoint = multiPoint;
exports.multiPolygon = multiPolygon;
exports.geometryCollection = geometryCollection;
exports.round = round;
exports.radiansToLength = radiansToLength;
exports.lengthToRadians = lengthToRadians;
exports.lengthToDegrees = lengthToDegrees;
exports.bearingToAzimuth = bearingToAzimuth;
exports.radiansToDegrees = radiansToDegrees;
exports.degreesToRadians = degreesToRadians;
exports.convertLength = convertLength;
exports.convertArea = convertArea;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.validateBBox = validateBBox;
exports.validateId = validateId;
exports.areaFactors = exports.unitsFactors = exports.factors = exports.earthRadius = void 0;

/**
 * @module helpers
 */

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 *
 * @memberof helpers
 * @type {number}
 */
var earthRadius = 6371008.8;
/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * @memberof helpers
 * @type {Object}
 */

exports.earthRadius = earthRadius;
var factors = {
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  degrees: earthRadius / 111325,
  feet: earthRadius * 3.28084,
  inches: earthRadius * 39.37,
  kilometers: earthRadius / 1000,
  kilometres: earthRadius / 1000,
  meters: earthRadius,
  metres: earthRadius,
  miles: earthRadius / 1609.344,
  millimeters: earthRadius * 1000,
  millimetres: earthRadius * 1000,
  nauticalmiles: earthRadius / 1852,
  radians: 1,
  yards: earthRadius / 1.0936
};
/**
 * Units of measurement factors based on 1 meter.
 *
 * @memberof helpers
 * @type {Object}
 */

exports.factors = factors;
var unitsFactors = {
  centimeters: 100,
  centimetres: 100,
  degrees: 1 / 111325,
  feet: 3.28084,
  inches: 39.37,
  kilometers: 1 / 1000,
  kilometres: 1 / 1000,
  meters: 1,
  metres: 1,
  miles: 1 / 1609.344,
  millimeters: 1000,
  millimetres: 1000,
  nauticalmiles: 1 / 1852,
  radians: 1 / earthRadius,
  yards: 1 / 1.0936
};
/**
 * Area of measurement factors based on 1 square meter.
 *
 * @memberof helpers
 * @type {Object}
 */

exports.unitsFactors = unitsFactors;
var areaFactors = {
  acres: 0.000247105,
  centimeters: 10000,
  centimetres: 10000,
  feet: 10.763910417,
  hectares: 0.0001,
  inches: 1550.003100006,
  kilometers: 0.000001,
  kilometres: 0.000001,
  meters: 1,
  metres: 1,
  miles: 3.86e-7,
  millimeters: 1000000,
  millimetres: 1000000,
  yards: 1.195990046
};
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */

exports.areaFactors = areaFactors;

function feature(geom, properties, options) {
  if (options === void 0) {
    options = {};
  }

  var feat = {
    type: "Feature"
  };

  if (options.id === 0 || options.id) {
    feat.id = options.id;
  }

  if (options.bbox) {
    feat.bbox = options.bbox;
  }

  feat.properties = properties || {};
  feat.geometry = geom;
  return feat;
}
/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<any>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = "Point";
 * var coordinates = [110, 50];
 * var geometry = turf.geometry(type, coordinates);
 * // => geometry
 */


function geometry(type, coordinates, _options) {
  if (_options === void 0) {
    _options = {};
  }

  switch (type) {
    case "Point":
      return point(coordinates).geometry;

    case "LineString":
      return lineString(coordinates).geometry;

    case "Polygon":
      return polygon(coordinates).geometry;

    case "MultiPoint":
      return multiPoint(coordinates).geometry;

    case "MultiLineString":
      return multiLineString(coordinates).geometry;

    case "MultiPolygon":
      return multiPolygon(coordinates).geometry;

    default:
      throw new Error(type + " is invalid");
  }
}
/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */


function point(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  if (!coordinates) {
    throw new Error("coordinates is required");
  }

  if (!Array.isArray(coordinates)) {
    throw new Error("coordinates must be an Array");
  }

  if (coordinates.length < 2) {
    throw new Error("coordinates must be at least 2 numbers long");
  }

  if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
    throw new Error("coordinates must contain numbers");
  }

  var geom = {
    type: "Point",
    coordinates: coordinates
  };
  return feature(geom, properties, options);
}
/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */


function points(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  return featureCollection(coordinates.map(function (coords) {
    return point(coords, properties);
  }), options);
}
/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */


function polygon(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
    var ring = coordinates_1[_i];

    if (ring.length < 4) {
      throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
    }

    for (var j = 0; j < ring[ring.length - 1].length; j++) {
      // Check if first point of Polygon contains two numbers
      if (ring[ring.length - 1][j] !== ring[0][j]) {
        throw new Error("First and last Position are not equivalent.");
      }
    }
  }

  var geom = {
    type: "Polygon",
    coordinates: coordinates
  };
  return feature(geom, properties, options);
}
/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */


function polygons(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  return featureCollection(coordinates.map(function (coords) {
    return polygon(coords, properties);
  }), options);
}
/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */


function lineString(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  if (coordinates.length < 2) {
    throw new Error("coordinates must be an array of two or more positions");
  }

  var geom = {
    type: "LineString",
    coordinates: coordinates
  };
  return feature(geom, properties, options);
}
/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */


function lineStrings(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  return featureCollection(coordinates.map(function (coords) {
    return lineString(coords, properties);
  }), options);
}
/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */


function featureCollection(features, options) {
  if (options === void 0) {
    options = {};
  }

  var fc = {
    type: "FeatureCollection"
  };

  if (options.id) {
    fc.id = options.id;
  }

  if (options.bbox) {
    fc.bbox = options.bbox;
  }

  fc.features = features;
  return fc;
}
/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */


function multiLineString(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  var geom = {
    type: "MultiLineString",
    coordinates: coordinates
  };
  return feature(geom, properties, options);
}
/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */


function multiPoint(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  var geom = {
    type: "MultiPoint",
    coordinates: coordinates
  };
  return feature(geom, properties, options);
}
/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */


function multiPolygon(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }

  var geom = {
    type: "MultiPolygon",
    coordinates: coordinates
  };
  return feature(geom, properties, options);
}
/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = turf.geometry("Point", [100, 0]);
 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
 * var collection = turf.geometryCollection([pt, line]);
 *
 * // => collection
 */


function geometryCollection(geometries, properties, options) {
  if (options === void 0) {
    options = {};
  }

  var geom = {
    type: "GeometryCollection",
    geometries: geometries
  };
  return feature(geom, properties, options);
}
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */


function round(num, precision) {
  if (precision === void 0) {
    precision = 0;
  }

  if (precision && !(precision >= 0)) {
    throw new Error("precision must be a positive number");
  }

  var multiplier = Math.pow(10, precision || 0);
  return Math.round(num * multiplier) / multiplier;
}
/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} distance
 */


function radiansToLength(radians, units) {
  if (units === void 0) {
    units = "kilometers";
  }

  var factor = factors[units];

  if (!factor) {
    throw new Error(units + " units is invalid");
  }

  return radians * factor;
}
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} radians
 */


function lengthToRadians(distance, units) {
  if (units === void 0) {
    units = "kilometers";
  }

  var factor = factors[units];

  if (!factor) {
    throw new Error(units + " units is invalid");
  }

  return distance / factor;
}
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} degrees
 */


function lengthToDegrees(distance, units) {
  return radiansToDegrees(lengthToRadians(distance, units));
}
/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */


function bearingToAzimuth(bearing) {
  var angle = bearing % 360;

  if (angle < 0) {
    angle += 360;
  }

  return angle;
}
/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */


function radiansToDegrees(radians) {
  var degrees = radians % (2 * Math.PI);
  return degrees * 180 / Math.PI;
}
/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */


function degreesToRadians(degrees) {
  var radians = degrees % 360;
  return radians * Math.PI / 180;
}
/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */


function convertLength(length, originalUnit, finalUnit) {
  if (originalUnit === void 0) {
    originalUnit = "kilometers";
  }

  if (finalUnit === void 0) {
    finalUnit = "kilometers";
  }

  if (!(length >= 0)) {
    throw new Error("length must be a positive number");
  }

  return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches, hectares
 * @param {number} area to be converted
 * @param {Units} [originalUnit="meters"] of the distance
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted area
 */


function convertArea(area, originalUnit, finalUnit) {
  if (originalUnit === void 0) {
    originalUnit = "meters";
  }

  if (finalUnit === void 0) {
    finalUnit = "kilometers";
  }

  if (!(area >= 0)) {
    throw new Error("area must be a positive number");
  }

  var startFactor = areaFactors[originalUnit];

  if (!startFactor) {
    throw new Error("invalid original units");
  }

  var finalFactor = areaFactors[finalUnit];

  if (!finalFactor) {
    throw new Error("invalid final units");
  }

  return area / startFactor * finalFactor;
}
/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */


function isNumber(num) {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}
/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */


function isObject(input) {
  return !!input && input.constructor === Object;
}
/**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */


function validateBBox(bbox) {
  if (!bbox) {
    throw new Error("bbox is required");
  }

  if (!Array.isArray(bbox)) {
    throw new Error("bbox must be an Array");
  }

  if (bbox.length !== 4 && bbox.length !== 6) {
    throw new Error("bbox must be an Array of 4 or 6 numbers");
  }

  bbox.forEach(function (num) {
    if (!isNumber(num)) {
      throw new Error("bbox must only contain numbers");
    }
  });
}
/**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */


function validateId(id) {
  if (!id) {
    throw new Error("id is required");
  }

  if (["string", "number"].indexOf(typeof id) === -1) {
    throw new Error("id must be a number or a string");
  }
}
},{}],"networkControl/networkControlWorker.js":[function(require,module,exports) {
"use strict";

var turf = _interopRequireWildcard(require("@turf/helpers"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// 2.108 SECONDS WITH 3537 FEATURES
// JavaScript toFixed() is very slow,
// self.importScripts('./turf.min.js');
var workerMasterNetwork = {
  type: "FeatureCollection",
  features: []
};
var workerMasterPointNetwork = {
  type: "FeatureCollection",
  features: []
};
var workerIds = [];
var networkIndex = [];
var networkTree = {
  type: "FeatureCollection",
  name: "networkTree",
  features: []
};
var netowrkTimeCheck = Date.now();
self.addEventListener('message', function (e) {
  // LOG ANY MESSAGES FOR DEBUGGING
  // this.console.log(e)
  if (e.data.features && e.data.name === "network") {
    workerMasterNetwork.features = e.data.features.slice();
    var linestring = turf.featureCollection([]);
    workerMasterNetwork.features.map(feature => {
      if (feature.geometry.coordinates[0][0].length) {
        feature.geometry.coordinates.map(line => {
          linestring.features.push(turf.lineString(geojsonPrecision(line, 8)));
        });
      } else {
        linestring.features.push(geojsonPrecision(feature, 8));
      }
    });
    workerMasterNetwork.features = linestring.features.slice(); // console.log(workerMasterNetwork)

    var geometryTypeCheck = true; //CHECKING THAT THE CONVERSION WORKED

    workerMasterNetwork.features.reduce((i, f) => {
      if (f.geometry.type != "LineString") error = true;
      return [...i, f.geometry.type];
    }, []);

    if (geometryTypeCheck) {
      console.log("all geometries are linestrings, the tool should work");
    } else {
      console.warn("all geometries are not linestrings, the tool may break");
      alert("all geometries are not linestrings, the tool may break");
    }

    this.console.log("worker added", workerMasterNetwork.features.length, "features to the master linear network ");
  }

  if (e.data.features && e.data.name === "pointNetwork") {
    workerMasterPointNetwork.features = e.data.features.slice();
    this.console.log("worker added", workerMasterPointNetwork.features.length, "features to the master point network ");
  }

  if (!e.data.features && e.data.geometry && e.data.geometry.type === "Point") {
    console.log("received network trace request", e.data); // GRAB CURRENT TIME TO CHECK DURATION OF NETWORK TRACE

    netowrkTimeCheck = Date.now(); // RESET NETWORK TREE & WORKER IDS

    networkTree.features = [];
    workerIds = new Array(workerMasterNetwork.features.length);
    networkIndex = new Array(workerMasterNetwork.features.length);
    networkIndex[e.data.properties.index] = {
      up: [e.data.properties.index]
    };
    var featureId = e.data.properties.index; //GET SEED FEATURES

    var networkFeatureCollection = networkLines(e.data, workerMasterNetwork, null, featureId);
    networkTree.features = networkFeatureCollection.features.slice(0); //BUILD NETWORK

    networkBuild(networkFeatureCollection, workerMasterNetwork, e.data.name);
  }
}, false);

function splitMultiLine(array) {
  return array.reduce((i, a) => {
    return [...i, ...a];
  }, []);
}

function networkBuild(lines, network, string) {
  let direction = string; // GET ALL UPSTREAM POINTS

  var networkPoints = [];

  if (direction === "upstream" || direction === "downstream") {
    // IGNORE LATERALS
    lines.features.map(function (f, i) {
      var coords = f.geometry.coordinates[0][0].length ? splitMultiLine(f.geometry.coordinates) : f.geometry.coordinates;
      var netowrkDirection = direction === "upstream" ? 0 : coords.length - 1;
      networkPoints.push(coords[netowrkDirection]);
    });
  } else {
    //INCLUDE LATERALS
    lines.features.map(function (f) {
      var coords = f.geometry.coordinates[0][0].length ? splitMultiLine(f.geometry.coordinates) : f.geometry.coordinates;

      for (var i = 0; i < coords.length; i++) {
        networkPoints.push(f.geometry.coordinates[i]);
      }
    });
  }

  var tempFeatures = {
    type: "FeatureCollection",
    features: []
  }; // GET NETWORK LINES FROM THESE POINTS

  for (let p = 0; p < networkPoints.length; p++) {
    var point = turf.point(networkPoints[p]);
    var tempFeatures02 = networkLines(point, network, direction);
    tempFeatures02.features.map(f => {
      tempFeatures.features.push(f);
      networkTree.features.push(f);
    });
  }

  if (tempFeatures.features.length > 0) {
    networkBuild(tempFeatures, network, direction);
  } else {
    console.warn("worker network trace took", Date.now() - netowrkTimeCheck, "ms");
    self.postMessage(networkTree);
  }
}

function networkLines(point, network, string, id) {
  var point = point;
  var a = point.geometry.coordinates;
  let direction = !string ? point.name : string;
  var networkSeed = [];

  for (var i = 0; i < network.features.length; i++) {
    if (workerIds[i]) {
      continue;
    }

    var f = network.features[i]; //TEST REPLACEMENT FOR POINT ON LINE booleanOnLine = 1500s, without = 0.200s

    var pointInLineVertices = false;
    f.geometry.coordinates.map(c => {
      if (a[0] == c[0] && a[1] == c[1]) pointInLineVertices = true;
    });

    if (pointInLineVertices) {
      // if (turf.booleanPointOnLine(point, f)) {
      var d = direction === "upstream" || direction === "upstream-laterals" ? 0 : f.geometry.coordinates.length - 1;
      var b = f.geometry.coordinates[d];

      if (a[0] != b[0] || a[1] != b[1]) {
        workerIds[i] = 1;
        networkSeed.push(f);

        if (!networkIndex[id]) {
          networkIndex[id] = {
            up: [i]
          };
        } else {
          networkIndex[id].up = [i, ...new Set(networkIndex[id].up)];
        }
      }
    }
  }

  ;
  return turf.featureCollection(networkSeed);
}

function geojsonPrecision(t, coordinatePrecision, extrasPrecision) {
  function point(p) {
    return p.map(function (e, index) {
      if (index < 2) {
        return 1 * e.toFixed(coordinatePrecision);
      } else {
        return 1 * e.toFixed(extrasPrecision);
      }
    });
  }

  function multi(l) {
    return l.map(point);
  }

  function poly(p) {
    return p.map(multi);
  }

  function multiPoly(m) {
    return m.map(poly);
  }

  function geometry(obj) {
    if (!obj) {
      return {};
    }

    switch (obj.type) {
      case "Point":
        obj.coordinates = point(obj.coordinates);
        return obj;

      case "LineString":
      case "MultiPoint":
        obj.coordinates = multi(obj.coordinates);
        return obj;

      case "Polygon":
      case "MultiLineString":
        obj.coordinates = poly(obj.coordinates);
        return obj;

      case "MultiPolygon":
        obj.coordinates = multiPoly(obj.coordinates);
        return obj;

      case "GeometryCollection":
        obj.geometries = obj.geometries.map(geometry);
        return obj;

      default:
        return {};
    }
  }

  function feature(obj) {
    obj.geometry = geometry(obj.geometry);
    return obj;
  }

  function _featureCollection(f) {
    f.features = f.features.map(feature);
    return f;
  }

  function geometryCollection(g) {
    g.geometries = g.geometries.map(geometry);
    return g;
  }

  if (!t) {
    return t;
  }

  switch (t.type) {
    case "Feature":
      return feature(t);

    case "GeometryCollection":
      return geometryCollection(t);

    case "FeatureCollection":
      return _featureCollection(t);

    case "Point":
    case "LineString":
    case "Polygon":
    case "MultiPoint":
    case "MultiPolygon":
    case "MultiLineString":
      return geometry(t);

    default:
      return t;
  }
}
},{"@turf/helpers":"../node_modules/@turf/helpers/dist/es/index.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63443" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","networkControl/networkControlWorker.js"], null)
//# sourceMappingURL=/networkControlWorker.4276a40e.js.map