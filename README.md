# Displaced Points

Displaced Points methodology works to visualize all features of a point layer, even if they have the same location. To do this, the map takes the points falling in a given Distance tolerance from each other (cluster) and places them around their barycenter following different Placement methods:

- [**Ring**](#grid): Places all the features on a circle whose radius depends on the number of features to display.
- [**Concentric Rings**](#concentric-rings): Uses a set of concentric circles to show the features.
- [**Spiral**](#spiral): Creates a spiral with the features farthest from the center of the group in each turn.
- [**Grid**](#grid): Generates a regular grid with a point symbol at each intersection.

> Note: Displaced Points methodology does not alter feature geometry, meaning that points are not moved from their position. Changes are only visual, for rendering purpose. Each barycenter is themselves a cluster with an attribute features that contain the original features.

## Install

### npm

```npm
npm i ol-displaced-points
```

## Usage

The DisplacedPoints class extends of cluster class from OpenLayers. Review examples [Vector Layer](https://openlayers.org/en/latest/examples/vector-layer.html) and [Clustered Features](https://openlayers.org/en/latest/examples/cluster.html) of OpenLayers to get context or review our [use example on CodeSandbox](https://codesandbox.io/s/ol-displaced-points-twijp1).

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Displaced Points</title>
    <meta charset="UTF-8" />
    <style>
      .map {
        width: 100%;
        height: 400px;
      }
    </style>
  </head>

  <body>
    <div id="map" class="map" />

    <script src="src/index.js" type="module"></script>
  </body>
</html>
```

```javascript
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

import DisplacedPoints from "ol-displaced-points";

const sourceDisplacedPoints = new DisplacedPoints({
  source: new VectorSource({
    url: "./features.geojson",
    format: new GeoJSON(),
  }),
  distance: 80,
  minDistance: 40,
});

new Map({
  layers: [
    new TileLayer({ source: new OSM() }),
    new VectorLayer({
      source: sourceDisplacedPoints,
    }),
  ],
  target: "map",
  view: new View({
    center: [-101.012614352653245, 20.905432044070093],
    zoom: 3,
    projection: "EPSG:4326",
  }),
});
```

![México Basic](./docs/mexico-basic.png)

### Style options

```javascript
...
import { Circle, Fill, Stroke, Style } from "ol/style";

const radiusCenter = 5;
const radiusPoints = 5;
const sourceDisplacedPoints = new DisplacedPoints({
  source: new VectorSource({
    url: "./features.geojson",
    format: new GeoJSON(),
  }),
  distance: 80,
  minDistance: 40,
  radiusCenterPoint: radiusCenter,
  radiusDisplacedPoints: radiusPoints,
});


function styleCircle(radius, stroke, fill = "#0000") {
  return new Style({
    image: new Circle({
      radius: radius,
      stroke: new Stroke({
        color: stroke,
        with: 1,
      }),
      fill: new Fill({
        color: fill,
      }),
    }),
  });
}

function styleDisplacedPoints(f) {
  if (f.get("ring")) {
    return styleCircle(f.get("ring").radius);
  }

  if (f.get("features")) {
    return styleCircle(radiusCenter, "white", "red");
  }

  return styleCircle(radiusPoints, "white", `#${f.get("cvegeo")}a`);
}
```

![México Colors](./docs/mexico-ring-colors.png)

### Placement methods

```javascript
new DisplacedPoints({
  ...
  placementMethod: "ring | concentric-rings | spiral | grid"
});
```

#### Ring

```javascript
placementMethod: "ring"; // default
```

![México Ring](./docs/mexico-ring.png)

#### Concentric Rings

```javascript
placementMethod: "concentric-rings";
```

![México Concentric Rings](./docs/mexico-concentric-rings.png)

#### Spiral

```javascript
placementMethod: "spiral";
```

![México Spiral](./docs/mexico-spiral.png)

#### Grid

```javascript
placementMethod: "grid";
```

![México Grid](./docs/mexico-grid.png)

### Delimit cluster

If you need delimit the clusters based on some category, use the column name with which you want to delimit on the parameter `delimiterField`.

```javascript
new DisplacedPoints({
  ...
  delimiterField: "<field name>"
});
```

### (distance between points)

coming soon...

## References

- [Qgis Point displacement renderer](https://docs.qgis.org/3.22/en/docs/user_manual/working_with_vector/vector_properties.html#point-displacement-renderer)

- [ol-ext: SelectCluster](http://viglino.github.io/ol-ext/examples/animation/map.animatedcluster.html)

- [ol.source.Cluster](https://openlayers.org/en/latest/apidoc/module-ol_source_Cluster-Cluster.html)
