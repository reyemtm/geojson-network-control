/**
 * @param {object} map mapbox map object
 */
function layerControl(options) {
  var layers = (!options.layers) ? undefined : options.layers;

  this.onAdd = function (map) {

    this._map = map;
    var mapLayers = this._map.getStyle().layers;
    var layerIndex = [];
    mapLayers.map(function(l,i) {
      var id = l.id;
      layerIndex.push(id, i)
    });
    // console.log(mapLayers)
    // console.log(layerIndex)
    var types = [];
    var colors = [];
    for (var l in layers) {
      var layer = layers[l];
      var index = layerIndex.indexOf(layer);
      console.log(index)
      types.push(mapLayers[layerIndex[index+1]].type);
      colors.push(mapLayers[layerIndex[index+1]].paint["line-color"][3])
    }
    // console.log(types, colors);

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this._container.style.fontSize = "1.5rem";
    this._container.style.padding = "0.5rem";
    this._container.style.textTransform = "capitalize";
    
    for (var t in types) {
      this._container.innerHTML += "<span style='color:" + colors[t] + ";width:20px; height:10px;font-weight:900;margin-right:0.5rem;'>&mdash;</span>" + layers[t] + "<br />"
    }

    return this._container;
  }
  this.onRemove = function () {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export {
  layerControl
};