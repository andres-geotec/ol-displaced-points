import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import CircleStyle from "ol/style/Circle";
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import VectorLayer from "ol/layer/Vector";
import CircleProps, { circumferenceFromRadius, radiusFromCircumference } from "circle-properties/";
import Circle from "ol/geom/Circle";
import GoniometricCircumference, { TAU } from "../../../src/GoniometricCircumference";
import LineString from "ol/geom/LineString";

function styleCircle(radius, strokeColor, fill = "#0000") {
  return new Style({
    image: new CircleStyle({
      radius: radius,
      stroke: new Stroke({
        color: strokeColor,
        with: 1,
      }),
      fill: new Fill({
        color: fill,
      }),
    }),
  });
}

function styleCustom(f) {
  // console.log(f.getGeometry().getCoordinates());
  if (f.get("ring")) {
    return new Style({
      stroke: new Stroke({
        color: "gray",
      }),
    });
  }
  if (f.get("features")) {
    return styleCircle(radiusCenter, "red", "transparent");
  }
  if (f.get("conector")) {
    return new Style({
      stroke: new Stroke({
        color: "black",
        width: 1,
      }),
    });
  }
  return styleCircle(radiusPoints, "green", "transparent");
}


const centerPoint = new Point([-99, 19]);

const radiusCenter = 5;
const radiusPoints = 10;
// const minDistancePoints = 0;
// const minDistanceCenter = 0;
const vectorSource = new VectorSource({
  features: [
    new Feature({
      geometry: centerPoint,
      features: [],
    }),
  ],
});

// map.addLayer(
//   new VectorLayer({
//     source: vectorSource,
//     style: styleCustom,
//   })
// );
let resoluition
export default function (_resoluition) {
  resoluition = _resoluition

  return new VectorLayer({
    source: vectorSource,
    style: styleCustom,
  })
}

function hypotenuseRightTriangleIsosceles(side) {
  return Math.SQRT2 * side;
}
function pixelsToMapUnits(pixels) {
  // return map.getView().getResolution() * pixels;
  return resoluition * pixels;
}

const displacementCenter =
  /*radiusCenter + minDistanceCenter + radiusPoints*/
  hypotenuseRightTriangleIsosceles(radiusCenter + radiusPoints);
const displacementPoints =
  /*radiusPoints + minDistancePoints + radiusPoints*/
  hypotenuseRightTriangleIsosceles(radiusPoints + radiusPoints);

const nFeatures = 8;

const maxCircunference = Math.max(
  circumferenceFromRadius(displacementCenter),
  displacementPoints * nFeatures
);

const circle = new CircleProps({
  radius: pixelsToMapUnits(radiusFromCircumference(maxCircunference)),
});

// add ring
vectorSource.addFeature(
  new Feature({
    geometry: new Circle(centerPoint.getCoordinates(), circle.radius),
    ring: circle.radius,
  })
);

const goniometric = new GoniometricCircumference({
  radianAngle: 2,
  radius: circle.radius,
  center: centerPoint.clone().getCoordinates(),
});

addConector(centerPoint.getCoordinates(), goniometric.pointB);
addConector(centerPoint.getCoordinates(), goniometric.pointC);
addConector(goniometric.pointB, goniometric.pointC);
addConector(goniometric.pointC, goniometric.pointE);
addConector(goniometric.pointE, goniometric.pointD);
addConector(goniometric.pointB, goniometric.pointD);


const angleStep = TAU / nFeatures;

for (
  var i = 0, currentAngle = 0;
  i < nFeatures;
  i++, currentAngle += angleStep
) {
  goniometric.radianAngle = currentAngle;

  // add conector
  addConector(goniometric.center, goniometric.pointB);

  // add displaced point
  vectorSource.addFeature(new Feature(new Point(goniometric.pointB)));
}


function addConector(coord1, coord2) {
  vectorSource.addFeatures([
    new Feature({
      geometry: new LineString([coord1, coord2]),
      conector: true,
    }),
  ]);
}
