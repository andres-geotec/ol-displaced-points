import Feature from "ol/Feature";
import Point from "ol/geom/Point";

export function Ring(
  centerPoint, // centerPoint
  symbolDiagonal, // diagonal type double
  circleAdditionPainterUnits,
  features,
  resolution
) {
  var featuresNuevos = [];
  const nFeatures = features.length;

  const minDiameterToFitSymbols =
    /** @type {double} */ (nFeatures * symbolDiagonal) / (2.0 * Math.PI);
  const radius =
    /** @type {double} */ Math.max(
      symbolDiagonal / 2,
      minDiameterToFitSymbols
    ) + circleAdditionPainterUnits;

  featuresNuevos.push(
    new Feature({
      geometry: new Point(centerPoint),
      anillo: {
        radius: radius / resolution,
      },
    })
  );

  const angleStep = /** @type {double} */ (2 * Math.PI) / nFeatures;
  var currentAngle = /** @type {double} */ 0.0;

  // console.log(minDiameterToFitSymbols, radius, angleStep);
  features.forEach((feature) => {
    // console.log(currentAngle);

    const sinusCurrentAngle = /** @type {double} */ Math.sin(currentAngle);
    const cosinusCurrentAngle = /** @type {double} */ Math.cos(currentAngle);
    const p = [
      centerPoint[0] + radius * sinusCurrentAngle,
      centerPoint[1] + radius * cosinusCurrentAngle,
    ];

    const newFeature = feature.clone();
    newFeature.setGeometry(new Point(p));
    featuresNuevos.push(newFeature);

    currentAngle += angleStep;
  });
  return featuresNuevos;
}

export default {
  ring: Ring,
};
