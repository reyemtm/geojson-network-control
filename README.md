# geojson-network-control
A GeoJSON Network plugin for Mapbox GL JS/MapLibre for simple upstream and downstream network tracing.

> This tool is very much in development.

## Usage in a Mapbox GL JS Map

```JavaScript
import NetworkControl from "./networkControl/networkControl.js"

//After the map and data have loaded

map.addControl(new NetworkControl({
  options: {
    originPoints: points, //geojson points
    linearNetwork: networkLines, //geojson linestrings
    originLayer: "points", //origin layer name
    color: "cyan", //color of highlight
    debug: true
  }
}), 'top-right');

  ```