/**
 * TODO add more console notifications
 * TODO add to blog post
 * TODO add requires that the geojson have an id at the feature.id level
 */

class NetworkControl {
  constructor(options) {

    console.log({networkTraceOptions: options.options})

    const opts = options.options;

    const originPoints = (!options) ? {} : options.options.originPoints;
    const originNetwork = (!options) ? {} : options.options.linearNetwork;
    const originLayer = (!options) ? "" : options.options.originLayer;
    const color = (!options) ? "yellow" : options.options.color;    

    var linearNetwork = {
      type: "FeatureCollection",
      features: []
    };
    linearNetwork.features = (originNetwork.features).slice(0)
    linearNetwork["name"] = "network";

    const blankGeoJSON = {
      type: "FeatureCollection",
      features: []
    }

    let networkTraceDirection = "upstream";

    var loadingTimeout;

    var loadingStart = function() {
      loadingTimeout = setTimeout(function() {
        document.getElementById("loading").classList.add("loading");
      }, 300)
    }

    var loadingStop = function() {
      document.getElementById("loading").classList.remove("loading");
      clearTimeout(loadingTimeout)
    }

    this.onAdd = function (m) {
      this._map = m;
      var networkMap = m;

      const worker = new Worker('./networkControlWorker.js');

      worker.addEventListener('message', function(e) {
  
        if (e.data.name && e.data.name === "networkTree") {
          console.log({data: e.data});
          
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
        this.getSource("worker").setData(blankGeoJSON);
        // console.log(networkMap.queryRenderedFeatures(e.point))
      });

      function networkControlClickHandler(e) {

        networkMap.moveLayer("workerHalo")
        networkMap.moveLayer("worker")

        var features = networkMap.queryRenderedFeatures(e.point, {layers: [originLayer]});

        if (features && features.length > 0) {
          loadingStart();
          var point = originPoints.features[features[0].id];
          point.name = networkTraceDirection;
          worker.postMessage(point)

          return

        }
      }

      this._btn = document.createElement('button');
      this._btn.type = 'button';
      this._btn['aria-label'] = 'Location Control';
      this._btn.title = "Trace Network";
      this._btn.id = "networkControlBtn";
      this._btn.style.lineHeight = "0px"
      this._btn.innerHTML = "<img src='https://icongr.am/material/vector-polyline.svg' with='80%' height='80%'> Click to start Tracing";
      this._btn.style.padding = "15px"
      this._btn.style.width = "auto"
      this._btn.onclick = function () {
        if (opts.debug && opts.debug === true) {
          console.warn('debugging is on')
        }

        networkMap.getSource("worker").setData(blankGeoJSON);

        var btn = this;

        networkTraceDirection = "upstream";

        console.log("tracing:", networkTraceDirection)

        if (!this.classList.contains("upstream") && !this.classList.contains("downstream")) {
          this.classList.add("upstream");
          this.style.backgroundColor = "skyblue";
          // this.children[0].src = "https://icongr.am/material/trending-up.svg";
          this.innerText = "Click a point to trace upstream"
          networkMap.on('click', networkControlClickHandler);
          return
        }

        if (this.classList.contains("upstream") && !this.classList.contains("laterals")) {
          this.classList.add("laterals");
          networkTraceDirection = "upstream-laterals";
          this.style.backgroundColor = "red";
          this.style.color = "white";
          this.innerText = "Click a point to trace upstream with laterals"
          networkMap.on('click', networkControlClickHandler)
          return
        }

        if (this.classList.contains("upstream") && this.classList.contains("laterals")) {
          this.classList.remove("upstream");
          this.classList.remove("laterals");
          this.classList.add("downstream");
          networkTraceDirection = "downstream";
          this.style.backgroundColor = "orange";
          this.style.color = "initial";
          // btn.children[0].src = "https://icongr.am/material/trending-down.svg";
          this.innerText = "Click a point to trace downstream"
          networkMap.on('click', networkControlClickHandler)
          return
        }

        if (this.classList.contains("downstream")) {
          this.classList.remove("downstream");
          this.style.backgroundColor = "white";
          // this.children[0].src = "https://icongr.am/material/vector-polyline.svg";
          this.innerText = "Click to start tracing"
          networkMap.off('click', networkControlClickHandler)
          return
        }

      };
      this._container = document.createElement('div');
      this._container.style.width = "auto";
      this._container.id = "networkControl";
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
      this._container.appendChild(this._btn);
      return this._container;
    }
    this.onRemove = function () {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
      networkMap = undefined;
    };
  }
}

export default NetworkControl