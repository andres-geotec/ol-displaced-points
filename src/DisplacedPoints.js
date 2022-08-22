/**
 * @module DisplacedPoints
 */

import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import Cluster from "./Cluster";
import Circle from "circle-properties";
import { add as addCoordinate } from "ol/coordinate.js";

/**
 * @typedef {Object} Options
 * @property {string} [placementMethod="ring"] Placement Method:
 * - `grid`: Places all the features on a circle whose radius depends on the number of
 * features to display.
 * - `concentric-rings`: Uses a set of concentric circles to show the features.
 * - `spiral`: Creates a spiral with the features farthest from the center of the group in
 * each turn.
 * - `grid`: Generates a regular grid with a point symbol at each intersection.
 * @property {number} [radioCenterPoint=6] centric point radius, used for the distance between
 * the centric point and the nearest displaced points.
 * @property {number} [radioDisplacedPoints=6] displaced points radius, used for the distance
 * between each displaced point.
 */

/**
 * @classdesc
 * Displaced Points methodology works to visualize all features of a point layer, even if they
 * have the same location. To do this, the map takes the points falling in a given Distance
 * tolerance from each other (cluster) and places them around their barycenter.
 * 
 * > Note: Displaced Points methodology does not alter feature geometry, meaning that points
 * are not moved from their position. Changes are only visual, for rendering purpose. Each
 * barycenter is themselves a cluster with an attribute features that contain the original
 * features.
 */
class DisplacedPoints extends Cluster {
  /**
   * @param {Options} options DisplacedPoints options.
   */
  constructor(options) {
    super(options);

    /**
     * @type {string}
     * @private
     */
    this.placementMethod = options.placementMethod || "ring";

    /**
     * @type {number}
     * @protected
     */
    this.radioCenterPoint = options.radioCenterPoint || 6;

    /**
     * @type {number}
     * @protected
     */
    this.radioDisplacedPoints = options.radioDisplacedPoints || 6;

    /**
     * @type {Array<Feature>}
     * @protected
     */
    this.displacedFeatures = [];

    /**
     * @type {Array<Feature>}
     * @protected
     */
    this.displacedRings = [];

    /**
     * @type {Array<Feature>}
     * @protected
     */
    this.displacedConnectors = [];
  }

  /**
   *
   * @returns {string}
   */
  getPlacementMethod() {
    return this.placementMethod;
  }

  /**
   *
   * @param {string} placementMethod
   */
  setPlacementMethod(placementMethod) {
    this.placementMethod = placementMethod;
    this.refresh();
  }

  /**
   * Remove all features from the source.
   * @param {boolean} [opt_fast] Skip dispatching of {@link module:ol/source/VectorEventType~VectorEventType#removefeature} events.
   * @api
   */
  clear(opt_fast) {
    this.features.length = 0;
    this.displacedFeatures = [];
    this.displacedRings = [];
    this.displacedConnectors = [];
    super.clear(opt_fast);
  }

  /**
   * Handle the source changing.
   */
  refresh() {
    this.clear();
    this.cluster();
    this.displacedPoints();
    this.addFeatures(this.allFeatures());
  }

  /**
   * 
   * @returns {Array<Feature>}
   */
  allFeatures() {
    return [
      ...this.displacedConnectors,
      ...this.displacedRings,
      ...this.features,
      ...this.displacedFeatures,
    ];
  }

  /**
   * @returns {Array<(import("ol/Feature").default)>} All the displaced points and rings
   * @protected
   */
  displacedPoints() {
    this.features.forEach((cluster) => {
      this.pointsGroup(cluster.get("geometry"), cluster.get("features"));
    });
  }

  /**
   * @param {import("ol/geom/Point").default} center Cluster centroid point
   * @param {Array<(import("ol/Feature").default)>} features Clustered features
   * @returns {Array<(import("ol/Feature").default)>} The displaced points and rings of the group
   * @protected
   */
  pointsGroup(center, features) {
    if (features.length === 1) return;

    /**
     * Teorema de Pitágoras
     * c² = b² + a²
     * c = √(b² + a²)
     * Math.SQRT2 = √(1² + 1²)
     * Math.SQRT2 = Math.pow(2, 1/2)
     */

    /**
     * Distancia entre el centroide del grupo y cualquiera de sus puntos deslazados si sus diametros
     * se tocaran
     * @type {number}
     */
    const distanceRadiusCenterAndDisplacedPoints =
      this.radioCenterPoint + this.radioDisplacedPoints;

    /**
     * Hipotenusa = Lado opuesto al ángulo recto en un triángulo rectángulo.
     * @type {number} √((radioCenterPoint + radioDisplacedPoints)² + (radioCenterPoint + radioDisplacedPoints)²)
     */
    const hypotenuseCenterAndPoints =
      distanceRadiusCenterAndDisplacedPoints * Math.SQRT2;

    /**
     * Hipotenusa = Lado opuesto al ángulo recto en un triángulo rectángulo.
     * @type {number} √(radioCenterPoint² + radioCenterPoint²) / 100
     */
    const hypotenuseCenter = this.radioCenterPoint * Math.SQRT2;

    switch (this.placementMethod) {
      case "ring":
        this.Ring(
          center.getCoordinates(),
          hypotenuseCenterAndPoints,
          hypotenuseCenter,
          features
        );
        break;

      case "concentric-rings":
        this.ConcentricRings(
          center.getCoordinates(),
          hypotenuseCenterAndPoints,
          hypotenuseCenter,
          features
        );
        break;

      case "grid":
        this.Grid(
          center.getCoordinates(),
          hypotenuseCenterAndPoints,
          hypotenuseCenter,
          features
        );
        break;

      case "spiral":
        this.Spiral(
          center.getCoordinates(),
          hypotenuseCenterAndPoints,
          hypotenuseCenter,
          features
        );
        break;

      default:
        console.error("Metodo de desplazamiento no permitido");
        break;
    }
  }

  /**
   *
   * @param {number} centerCords
   * @param {number} hypotenuseCenterAndPoints
   * @param {number} hypotenuseCenter
   * @param {Array<Feature>} features
   */
  Ring(centerCords, hypotenuseCenterAndPoints, hypotenuseCenter, features) {
    const nFeatures = features.length;

    const minCircleToFitPoints = new Circle({
      circumference: nFeatures * hypotenuseCenterAndPoints,
    });
    const maxDisplacementDistance = Math.max(
      hypotenuseCenterAndPoints / 2,
      minCircleToFitPoints.radius
    );
    const radiusRing = maxDisplacementDistance + hypotenuseCenter;

    this.addRing(centerCords, { radius: radiusRing });

    const radiusRingPix = this.numberToPixelUnits(radiusRing);
    const angleStep = (2 * Math.PI) / nFeatures;
    var currentAngle = 0.0;

    features.forEach((feature) => {
      this.addDisplacedPoints(feature, [
        centerCords[0] + radiusRingPix * Math.sin(currentAngle),
        centerCords[1] + radiusRingPix * Math.cos(currentAngle),
      ]);

      currentAngle += angleStep;
    });
  }

  ConcentricRings(
    centerCords,
    hypotenuseCenterAndPoints,
    hypotenuseCenter,
    features
  ) {
    const nFeatures = features.length;
    const centerDiagonal = this.radioCenterPoint;

    var pointsRemaining = nFeatures;
    var ringNumber = 1;
    const firstRingRadius =
      centerDiagonal / 2.0 + hypotenuseCenterAndPoints / 2.0;
    var featureIndex = 0;

    while (pointsRemaining > 0) {
      const radiusCurrentRing = Math.max(
        firstRingRadius +
          (ringNumber - 1) * hypotenuseCenterAndPoints +
          ringNumber * hypotenuseCenter,
        0.0
      );

      this.addRing(centerCords, { radius: radiusCurrentRing });

      const maxPointsCurrentRing = Math.max(
        Math.floor(
          (2 * Math.PI * radiusCurrentRing) / hypotenuseCenterAndPoints
        ),
        1.0
      );
      const actualPointsCurrentRing = Math.min(
        maxPointsCurrentRing,
        pointsRemaining
      );

      const angleStep = (2 * Math.PI) / actualPointsCurrentRing;
      const radiusCurrentRingPix = this.numberToPixelUnits(radiusCurrentRing);
      var currentAngle = 0;
      for (var i = 0; i < actualPointsCurrentRing; ++i) {
        this.addDisplacedPoints(features[featureIndex], [
          centerCords[0] + radiusCurrentRingPix * Math.sin(currentAngle),
          centerCords[1] + radiusCurrentRingPix * Math.cos(currentAngle),
        ]);

        currentAngle += angleStep;
        featureIndex++;
      }

      pointsRemaining -= actualPointsCurrentRing;
      ringNumber++;
    }
  }

  Grid(centerCords, hypotenuseCenterAndPoints, hypotenuseCenter, features) {
    var puntosNuevos = [];

    const nFeatures = features.length;
    // var gridRadius = /** @type {double} */ -1.0;
    var gridSize = -1;

    const centerDiagonal = this.radioCenterPoint;
    var pointsRemaining = nFeatures;
    gridSize = Math.ceil(Math.sqrt(pointsRemaining));

    if (pointsRemaining - Math.pow(gridSize - 1, 2) < gridSize) gridSize -= 1;

    const originalPointRadius =
      (centerDiagonal / 2 +
        hypotenuseCenterAndPoints / 2 +
        hypotenuseCenterAndPoints) /
      2;

    const userPointRadius = this.numberToPixelUnits(
      originalPointRadius + hypotenuseCenter
    );

    var yIndex = 0;
    while (pointsRemaining > 0) {
      for (var xIndex = 0; xIndex < gridSize && pointsRemaining > 0; xIndex++) {
        puntosNuevos.push([
          centerCords[0] + userPointRadius * xIndex,
          centerCords[1] + userPointRadius * yIndex,
        ]);
        pointsRemaining--;
      }

      yIndex++;
    }

    const shiftAmount = (-userPointRadius * (gridSize - 1)) / 2;
    features.forEach((feature, i) => {
      this.addDisplacedPoints(
        feature,
        addCoordinate(puntosNuevos[i], [shiftAmount, shiftAmount])
      );
    });
  }

  Spiral(centerCords, hypotenuseCenterAndPoints, hypotenuseCenter, features) {
    var radiusCurrent;
    var currentAngle = 0;
    var diameter = 2 * Math.max(hypotenuseCenterAndPoints, hypotenuseCenter);

    features.forEach((feature) => {
      radiusCurrent = diameter / 2 + (diameter * currentAngle) / (2 * Math.PI);
      currentAngle = currentAngle + (diameter) / radiusCurrent;
      const radiusCurrentPix = this.numberToPixelUnits(radiusCurrent);

      this.addDisplacedPoints(feature, [
        centerCords[0] + radiusCurrentPix * Math.sin(currentAngle),
        centerCords[1] + radiusCurrentPix * Math.cos(currentAngle),
      ]);
    });
  }

  addRing(coordinates, options) {
    this.displacedRings.push(
      new Feature({
        geometry: new Point(coordinates),
        anillo: options,
      })
    );
  }

  addDisplacedPoints(feature, coordinates) {
    const newFeature = feature.clone();
    newFeature.setGeometry(new Point(coordinates));
    this.displacedFeatures.push(newFeature);
  }

  /**
   *
   * @param {number} number
   * @returns {number}
   */
  numberToPixelUnits(number) {
    return number * this.resolution;
  }

  /**
   *
   * @param {number} pixelUnits
   * @returns {number}
   */
  pixelUnitsToNumber(pixelUnits) {
    return pixelUnits / this.resolution;
  }
}

export default DisplacedPoints;
