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
})({"networkControl/networkControl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * TODO add more console notifications
 * TODO add to blog post
 * TODO add requires that the geojson have an id at the feature.id level
 */
class NetworkControl {
  constructor(options) {
    console.log({
      networkTraceOptions: options.options
    });
    const opts = options.options;
    const originPoints = !options ? {} : options.options.originPoints;
    const originNetwork = !options ? {} : options.options.linearNetwork;
    const originLayer = !options ? "" : options.options.originLayer;
    const color = !options ? "yellow" : options.options.color;
    var linearNetwork = {
      type: "FeatureCollection",
      features: []
    };
    linearNetwork.features = originNetwork.features.slice(0);
    linearNetwork["name"] = "network";
    const blankGeoJSON = {
      type: "FeatureCollection",
      features: []
    };
    let networkTraceDirection = "upstream";
    var loadingTimeout;

    var loadingStart = function () {
      loadingTimeout = setTimeout(function () {
        document.getElementById("loading").classList.add("loading");
      }, 300);
    };

    var loadingStop = function () {
      document.getElementById("loading").classList.remove("loading");
      clearTimeout(loadingTimeout);
    };

    this.onAdd = function (m) {
      this._map = m;
      var networkMap = m;
      const worker = new Worker("/networkControlWorker.4276a40e.js");
      worker.addEventListener('message', function (e) {
        if (e.data.name && e.data.name === "networkTree") {
          console.log({
            data: e.data
          });
          networkMap.getSource("worker").setData(e.data);
          loadingStop();
        }
      }, false);
      worker.postMessage(linearNetwork);
      originPoints.name = "pointNetwork";
      worker.postMessage(originPoints);
      networkMap.addSource("worker", {
        type: "geojson",
        data: blankGeoJSON
      });
      networkMap.addLayer({
        id: "workerHalo",
        type: "line",
        source: "worker",
        paint: {
          "line-color": color,
          "line-width": 8,
          "line-opacity": 0.6
        }
      });
      networkMap.addLayer({
        id: "worker",
        type: "line",
        source: "worker",
        paint: {
          "line-color": color,
          "line-width": 4,
          "line-opacity": 1
        }
      });
      networkMap.on('click', function (e) {
        this.getSource("worker").setData(blankGeoJSON); // console.log(networkMap.queryRenderedFeatures(e.point))
      });

      function networkControlClickHandler(e) {
        networkMap.moveLayer("workerHalo");
        networkMap.moveLayer("worker");
        var features = networkMap.queryRenderedFeatures(e.point, {
          layers: [originLayer]
        });

        if (features && features.length > 0) {
          loadingStart();
          var point = originPoints.features[features[0].id];
          point.name = networkTraceDirection;
          worker.postMessage(point);
          return;
        }
      }

      this._btn = document.createElement('button');
      this._btn.type = 'button';
      this._btn['aria-label'] = 'Location Control';
      this._btn.title = "Trace Network";
      this._btn.id = "networkControlBtn";
      this._btn.style.lineHeight = "0px";
      this._btn.innerHTML = "<img src='https://icongr.am/material/vector-polyline.svg' with='80%' height='80%'> Click to start Tracing";
      this._btn.style.padding = "15px";
      this._btn.style.width = "auto";

      this._btn.onclick = function () {
        if (opts.debug && opts.debug === true) {
          console.warn('debugging is on');
        }

        networkMap.getSource("worker").setData(blankGeoJSON);
        var btn = this;
        networkTraceDirection = "upstream";
        console.log("tracing:", networkTraceDirection);

        if (!this.classList.contains("upstream") && !this.classList.contains("downstream")) {
          this.classList.add("upstream");
          this.style.backgroundColor = "skyblue"; // this.children[0].src = "https://icongr.am/material/trending-up.svg";

          this.innerText = "Click a point to trace upstream";
          networkMap.on('click', networkControlClickHandler);
          return;
        }

        if (this.classList.contains("upstream") && !this.classList.contains("laterals")) {
          this.classList.add("laterals");
          networkTraceDirection = "upstream-laterals";
          this.style.backgroundColor = "red";
          this.style.color = "white";
          this.innerText = "Click a point to trace upstream with laterals";
          networkMap.on('click', networkControlClickHandler);
          return;
        }

        if (this.classList.contains("upstream") && this.classList.contains("laterals")) {
          this.classList.remove("upstream");
          this.classList.remove("laterals");
          this.classList.add("downstream");
          networkTraceDirection = "downstream";
          this.style.backgroundColor = "orange";
          this.style.color = "initial"; // btn.children[0].src = "https://icongr.am/material/trending-down.svg";

          this.innerText = "Click a point to trace downstream";
          networkMap.on('click', networkControlClickHandler);
          return;
        }

        if (this.classList.contains("downstream")) {
          this.classList.remove("downstream");
          this.style.backgroundColor = "white"; // this.children[0].src = "https://icongr.am/material/vector-polyline.svg";

          this.innerText = "Click to start tracing";
          networkMap.off('click', networkControlClickHandler);
          return;
        }
      };

      this._container = document.createElement('div');
      this._container.style.width = "auto";
      this._container.id = "networkControl";
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

      this._container.appendChild(this._btn);

      return this._container;
    };

    this.onRemove = function () {
      this._container.parentNode.removeChild(this._container);

      this._map = undefined;
      networkMap = undefined;
    };
  }

}

var _default = NetworkControl;
exports.default = _default;
},{"./networkControlWorker.js":[["networkControlWorker.4276a40e.js","networkControl/networkControlWorker.js"],"networkControlWorker.4276a40e.js.map","networkControl/networkControlWorker.js"]}],"app.js":[function(require,module,exports) {
"use strict";

var _networkControl = _interopRequireDefault(require("./networkControl/networkControl.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lines, points, networkLines, selected;
selected = false;
var map = new mapboxgl.Map({
  container: 'map',
  hash: true,
  style: {
    "version": 8,
    "name": "blank",
    "sources": {
      "none": {
        "type": "vector",
        "url": ""
      }
    },
    "layers": [{
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "whitesmoke"
      }
    }]
  },
  center: [-82.00991, 39.94092],
  zoom: 14,
  debug: 1
});
map.on('load', function () {
  fetchURLs().then(data => {
    buildMap(data);
  });
}); //https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8

async function fetchURLs() {
  try {
    var data = await Promise.all([
    /* Alternatively store each in an array */
    // var [x, y, z] = await Promise.all([
    // parse results as json; fetch data response has several reader methods available:
    //.arrayBuffer()
    //.blob()
    //.formData()
    //.json()
    //.text()
    fetch('data/lines.geojson').then(response => response.json()), fetch('data/points.geojson').then(response => response.json())]);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function buildMap(data) {
  // console.log(data);
  data[0].features.map(function (f, i) {
    f.properties.color = "#202020";
    f.properties.index = i;
    f.id = i;
  });
  lines = {
    type: "FeatureCollection",
    features: []
  };
  data[0].features.map(function (f) {
    if (f.properties.class != "Private") {
      lines.features.push(f);
    }
  });
  networkLines = {
    type: "FeatureCollection",
    features: lines.features.slice(0)
  };
  addLayer(map, 'geojsonLines', 'line', lines, "color", 4);
  map.setFilter("geojsonLines", ["!=", ["get", "subclass"], "Lateral"]);
  console.log('line data loaded');
  data[1].features.map(function (f, i) {
    f.properties.index = i;
    f.id = i;
  });
  points = {
    type: "FeatureCollection",
    features: data[1].features.slice()
  }; // console.log(points)

  addLayer(map, 'points', 'circle', points, '#202020', {
    stops: [[12, 3], [22, 8]]
  });
  map.setFilter("points", ["!=", ["get", "class"], "Tap"]);
  console.log('point data loaded');
  map.addControl(new _networkControl.default({
    options: {
      originPoints: points,
      linearNetwork: networkLines,
      originLayer: "points",
      color: "cyan",
      debug: true
    }
  }), 'top-right');
  document.querySelector("#networkControlBtn").click();
}

var highlightIdPoints = null;
map.on('mouseenter', 'points', function (e) {
  if (e.features.length > 0) {
    if (highlightIdPoints) {
      map.setFeatureState({
        source: 'points',
        id: highlightIdPoints
      }, {
        highlight: false
      });
    }

    highlightIdPoints = e.features[0].id;
    map.setFeatureState({
      source: 'points',
      id: highlightIdPoints
    }, {
      highlight: true
    });
    selected = true;
  }
}); // map.on('mouseenter', 'geojsonLines', function (e) {
//   if (e.features.length > 0) {
//     if (highlightId) {
//       map.setFeatureState({source: 'geojsonLines', id: highlightId}, { highlight: false});
//     }
//     highlightId = e.features[0].id;
//     map.setFeatureState({source: 'geojsonLines', id: highlightId}, { highlight: true});
//   }
// });

map.on('mouseleave', 'points', function () {
  if (highlightIdPoints) {
    map.setFeatureState({
      source: 'points',
      id: highlightIdPoints
    }, {
      highlight: false
    });
    highlightIdPoints = null;
  }
}); // map.on('mouseleave', 'geojsonLines', function () {
//   if (highlightId) {
//     map.setFeatureState({source: 'geojsonLines', id: highlightId}, { highlight: false});
//   }
//   highlightId = null;
// });

function addLayer(m, name, type, data, color, size) {
  var paint;

  if (!size && type === 'fill') {
    paint = {
      'fill-color': color,
      'fill-opacity': 0.5,
      'fill-outline-color': 'transparent'
    };
  } else {
    paint = type === 'line' ? {
      "line-color": ["case", ["boolean", ["feature-state", "highlight"], false], "#00ffff", ["get", "color"]],
      "line-width": size
    } : {
      "circle-color": ["case", ["boolean", ["feature-state", "highlight"], false], "#00ffff", color],
      "circle-radius": size,
      "circle-stroke-width": 3,
      "circle-stroke-opacity": 0.9,
      "circle-stroke-color": "white"
    };
  }

  m.addLayer({
    id: name,
    type: type,
    source: {
      type: "geojson",
      data: data
    },
    paint: paint
  });
  m.on('mouseenter', name, function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  m.on('mouseleave', name, function () {
    map.getCanvas().style.cursor = '';
  });
} // map.on("click", function(e) {
//   var features = map.queryRenderedFeatures(e.point);
//   var origin = features;
//   console.log(origin)
// })
},{"./networkControl/networkControl.js":"networkControl/networkControl.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map