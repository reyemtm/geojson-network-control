import NetworkControl from "./networkControl/networkControl.js"

var lines, points, networkLines, selected;
const colors = {
  dark: "#111418",
  // highlight: "#0CE676",
  highlight: "fuchsia"
  // highlight: "#3592FD",
  // highlight: "#55CBE8"
}

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
        "background-color": colors.dark
      }
    }]
  },
  center: [-82.00991,39.94092],
  zoom: 14,
  debug: 1
});

map.on('load', function () {
  fetchURLs()
  .then(data => { 
    buildMap(data)
  })
});

//https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8
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
      fetch('data/lines.geojson').then((response) => response.json()),
      fetch('data/points.geojson').then((response) => response.json())
    ]);

    return data

  } catch (error) {
    console.log(error);
  }
}

function buildMap(data) {
  // console.log(data);

  data[0].features.map(function (f, i) {
    f.properties.color = "white";
    f.properties.index = i;
    f.id = i;
  })

  lines = {
    type: "FeatureCollection",
    features: []
  }

  data[0].features.map(function(f) {
    if (f.properties.class != "Private") {
      lines.features.push(f)
    }
  })

  networkLines = {
    type: "FeatureCollection",
    features: lines.features.slice(0)
  }

  addLayer(map, 'geojsonLines', 'line', lines, "color", 4);

  map.setFilter("geojsonLines", ["!=", ["get", "subclass"], "Lateral"])

  console.log('line data loaded')

  data[1].features.map(function (f, i) {
    f.properties.index = i;
    f.id = i;
  });

  points = {
    type: "FeatureCollection",
    features: data[1].features.slice()
  }

  // console.log(points)
  
  addLayer(map, 'points', 'circle', points, colors.dark, {stops: [[12,2.5], [22,8]]});
  map.setFilter("points", ["!=", ["get", "class"], "Tap"])

  console.log('point data loaded')

  const networkControl = new NetworkControl({
    options: {
      originPoints: points,
      linearNetwork: networkLines,
      originLayer: "points",
      color: colors.highlight,
      debug: true,
      state: "downstream",
    }
  });
  map.addControl(networkControl, 'top-right'
  );
  // document.getElementById('header').appendChild(networkControl.onAdd(map));

  //click a point randomly at an interval of 1 second to test networkControl
  const int = setInterval(function() {
    var features = map.queryRenderedFeatures({layers: ['points']});
    var origin = features[Math.floor(Math.random() * features.length)];
    networkControl.trace(null, origin)
  },600  )

  map.on('click', function() {
    clearInterval(int)
  });
  document.querySelector("#networkControlBtn").addEventListener('click', function() {
    clearInterval(int)
  })

}

var highlightIdPoints = null;

map.on('mouseenter', 'points', function (e) {
  if (e.features.length > 0) {
    if (highlightIdPoints) {
      map.setFeatureState({source: 'points', id: highlightIdPoints}, { highlight: false});
    }
    highlightIdPoints = e.features[0].id;
      map.setFeatureState({source: 'points', id: highlightIdPoints}, { highlight: true});
      selected = true;
    }
});

// map.on('mouseenter', 'geojsonLines', function (e) {
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
    map.setFeatureState({source: 'points', id: highlightIdPoints}, { highlight: false});
    highlightIdPoints = null;
  }
});

// map.on('mouseleave', 'geojsonLines', function () {
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
    }
  }else{
    paint = (type === 'line') ?
    {
      "line-color": ["case", ["boolean", ["feature-state", "highlight"], false], colors.highlight, ["get", "color"]],
      "line-width": size
    } : {
      "circle-color": ["case", ["boolean", ["feature-state", "highlight"], false], colors.highlight, color],
      "circle-radius": size,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.9,
      "circle-stroke-color": "white"
    }
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
}

// map.on("click", function(e) {
//   var features = map.queryRenderedFeatures(e.point);
//   var origin = features;
//   console.log(origin)
// })