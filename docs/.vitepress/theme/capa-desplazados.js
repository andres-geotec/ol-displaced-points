import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';
// import DisplacedPoints from "../../../src/DisplacedPoints";
import DisplacedPoints from "../../../build/ol-displaced-points/DisplacedPoints";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

const radiusCenter = 5;
const radiusPoints = 5;

export default new VectorLayer({
  source: new DisplacedPoints({
    source: new VectorSource({
      url: 'https://sisdai-mapas.conahcyt.mx/assets/estados-centroides.geojson',
      format: new GeoJSON(),
    }),
    distance: 80,
    minDistance: 40,
    // delimiterField: 'grado_marg',
    radiusCenterPoint: radiusCenter,
    radiusDisplacedPoints: radiusPoints,
  }),
  style: styleDisplacedPoints,
});

function styleCircle(radius, stroke, fill = "#0000") {
  return new Style({
    image: new CircleStyle({
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
