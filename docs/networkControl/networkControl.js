/**
 * TODO add more console notifications
 * TODO add to blog post
 * TODO add requires that the geojson have an id at the feature.id level
 */

class NetworkControl {
  constructor(options) {
    console.log({ networkTraceOptions: options.options });

    const opts = { ...{ state: "none" }, ...options.options };

    this._worker = new Worker("./networkControl/networkControlWorker.js");
    this.worker = null;
    this._map = null;
    this._traceDirection = opts.state;

    const originPoints = !options ? {} : options.options.originPoints;
    const originNetwork = !options ? {} : options.options.linearNetwork;
    const originLayer = !options ? "" : options.options.originLayer;
    const color = !options ? "yellow" : options.options.color;

    var linearNetwork = {
      type: "FeatureCollection",
      features: [],
    };
    linearNetwork.features = originNetwork.features.slice(0);
    linearNetwork["name"] = "network";

    const blankGeoJSON = {
      type: "FeatureCollection",
      features: [],
    };
    // let this._traceDirection = opts.state;

    // var loadingTimeout;

    // var loadingStart = function () {
    //   loadingTimeout = setTimeout(function () {
    //     document.getElementById("loading").classList.add("loading");
    //   }, 300);
    // };

    // var loadingStop = function () {
    //   document.getElementById("loading").classList.remove("loading");
    //   clearTimeout(loadingTimeout);
    // };

    this.onAdd = function (m) {
      this._map = m;

      this._worker.addEventListener(
        "message",
        (e) => {
          if (e.data.name && e.data.name === "networkTree") {
            // console.log({data: e.data});

            this._map.getSource("worker").setData(e.data);

            // loadingStop();
          }
        },
        false
      );

      this._worker.postMessage(linearNetwork);

      originPoints.name = "pointNetwork";
      this._worker.postMessage(originPoints);

      this._map.addSource("worker", {
        type: "geojson",
        data: blankGeoJSON,
      });

      this._map.addLayer({
        id: "workerHalo",
        type: "line",
        source: "worker",
        paint: {
          "line-color": color,
          "line-width": 8,
          "line-opacity": 0.6,
        },
      });

      this._map.addLayer({
        id: "worker",
        type: "line",
        source: "worker",
        paint: {
          "line-color": color,
          "line-width": 4,
          "line-opacity": 1,
        },
      });

      this._map.on("click", function (e) {
        this.getSource("worker").setData(blankGeoJSON);
        // console.log(networkMap.queryRenderedFeatures(e.point))
      });

      const states = {
        upstream: () => {
          console.log("upstream");
          this._traceDirection = "upstream";
          this._btn.classList.add("upstream");
          this._btn.style.backgroundColor = "white";
          // this.children[0].src = "https://icongr.am/material/trending-up.svg";
          this._btn.innerHTML = "Upstream"
          this._map.on("click", this.trace);
        },
        laterals: () => {
          console.log("laterals");
          this._traceDirection = "laterals";
          this._btn.classList.add("laterals");
          this._btn.style.backgroundColor = "white";
          // this._btn.style.color = "white";
          this._btn.innerHTML = "Laterals"
          this._map.on("click", this.trace);
        },
        downstream: () => {
          console.log("downstream");
          this._traceDirection = "downstream";
          this._btn.classList.remove("upstream");
          this._btn.classList.remove("laterals");
          this._btn.classList.add("downstream");
          this._btn.style.backgroundColor = "white";
          this._btn.style.color = "initial";
          // btn.children[0].src = "https://icongr.am/material/trending-down.svg";
          this._btn.innerText = "Downstream";
          this._map.on("click", this.trace);
          this._map.on("mousemove", this.trace);
        },
        none: () => {
          console.log("none");
          this._traceDirection = "none";
          this._btn.classList.remove("downstream");
          this._btn.style.backgroundColor = "white";
          // this._btn.children[0].src = "https://icongr.am/material/vector-polyline.svg";
          this._btn.innerText = "Click to start tracing";
          this._map.off("click", this.trace);
          this._map.off("mousemove", this.trace);
        },
      };

      this._btn = document.createElement("button");
      this._btn.type = "button";
      this._btn["aria-label"] = "Location Control";
      this._btn.title = "Trace Network";
      this._btn.id = "networkControlBtn";
      this._btn.innerHTML =
        "<img src='https://icongr.am/material/vector-polyline.svg' with='80%' height='80%'> Click to start Tracing";
      this._btn.style.height = "auto";
      this._btn.style.padding = "15px";
      this._btn.style.width = "auto";
      this._btn.onclick = () => {
        if (opts.debug && opts.debug === true) {
          console.warn("debugging is on");
        }

        this._map.getSource("worker").setData(blankGeoJSON);

        switch (this._traceDirection) {
          case "upstream":
            states["laterals"]();
            break;
          case "laterals":
            states["downstream"]();
            break;
          case "downstream":
            states["none"]();
            break;
          case "none":
            states["upstream"]();
            break;
        }
      };

      states[opts.state]();

      this._container = document.createElement("div");
      this._container.style.width = "auto";
      this._container.id = "networkControl";
      this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
      this._container.appendChild(this._btn);
      return this._container;
    };

    this.trace = (e, origin) => {
      this._map.moveLayer("workerHalo");
      this._map.moveLayer("worker");

      const features = origin ? [origin] : this._map.queryRenderedFeatures(e.point, { layers: [originLayer] });

      if (!features || !features.length) return;
      // loadingStart();
      var point = originPoints.features[features[0].id];
      point.name = this._traceDirection;
      this._worker.postMessage(point);
    };

    this.onRemove = function () {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
      networkMap = undefined;
    };
  }
}

export default NetworkControl;
