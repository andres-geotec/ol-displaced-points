/**
 * @module DisplacedPoints
 */

import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import methodsPlacement from "./methodsPlacement";
import Cluster from "./Cluster";
import CircleProperties from "./Circle";

class DisplacedPoints extends Cluster {
  /**
   * @param {Options} options DisplacedPoints options.
   */
  constructor(options) {
    console.log("instancioansdo DisplacedPoints");
    super(options);

    /**
     * @type {string}
     * @protected
     */
    this.methodPlacement = methodsPlacement[options.methodPlacement || "ring"];

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

    this.displacedFeatures = [];
    this.displacedRings = [];
    this.displacedConnectors = [];
  }

  /**
   * Handle the source changing.
   */
  refresh() {
    this.clear();
    this.cluster();
    // this.addFeatures(this.features);
    this.addFeatures([...this.features, ...this.displacedPoints()]);
  }

  allFeatures() {
    return [
      ...this.displacedRings,
      ...this.displacedConnectors,
      ...this.displacedFeatures,
      ...this.features,
    ];
  }

  /**
   * @returns {Array<(import("ol/Feature").default)>} All the displaced points and rings
   * @protected
   */
  displacedPoints() {
    if (this.features.length) {
      const cluster = this.features[0];
      return this.pointsGroup(cluster.get("geometry"), cluster.get("features"));
    }

    return this.features
      .map((cluster) =>
        this.pointsGroup(cluster.get("geometry"), cluster.get("features"))
      )
      .flat();
  }

  /**
   * @param {import("ol/geom/Point").default} center Cluster centroid point
   * @param {Array<(import("ol/Feature").default)>} features Clustered features
   * @returns {Array<(import("ol/Feature").default)>} The displaced points and rings of the group
   * @protected
   */
  pointsGroup(center, features) {
    if (features.length === 1) {
      return [];
    }

    /**
     * Teorema de Pitágoras
     * c² = √(b² + a²)
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

    // return [];

    return this.Ring(
      center.getCoordinates(),
      this.numberToPixelUnits(hypotenuseCenterAndPoints),
      this.numberToPixelUnits(hypotenuseCenter),
      features,
      this.resolution
    );
  }

  /**
   *
   * @param {*} centerPoint
   * @param {*} symbolDiagonal
   * @param {*} circleAdditionPainterUnits
   * @param {*} features
   * @param {*} resolution
   * @returns
   */
  Ring(
    centerPoint,
    hypotenuseCenterAndPoints,
    hypotenuseCenter,
    features,
    resolution
  ) {
    var featuresNuevos = [];
    const nFeatures = features.length;

    const minCircleToFitPoints = new CircleProperties({
      circumference: nFeatures * hypotenuseCenterAndPoints,
    });

    const maxDisplacementDistance = Math.max(
      hypotenuseCenterAndPoints / 2,
      minCircleToFitPoints.radius
    );

    /**
     * @type {number}
     */
    const radiusOfTheRing = maxDisplacementDistance + hypotenuseCenter;

    featuresNuevos.push(
      this.createRing(centerPoint, {
        anillo: {
          radius: this.pixelUnitsToNumber(radiusOfTheRing),
        },
      })
    );

    const angleStep = (2 * Math.PI) / nFeatures;
    var currentAngle = 0.0;

    features.forEach((feature) => {
      featuresNuevos.push(
        this.changeCoordinatesOfFeature(feature, [
          centerPoint[0] + radiusOfTheRing * Math.sin(currentAngle),
          centerPoint[1] + radiusOfTheRing * Math.cos(currentAngle),
        ])
      );

      currentAngle += angleStep;
    });

    return featuresNuevos;
  }

  createRing(coordinates, options) {
    return new Feature({
      geometry: new Point(coordinates),
      ...options,
    });
  }

  changeCoordinatesOfFeature(feature, p) {
    const newFeature = feature.clone();
    newFeature.setGeometry(new Point(p));
    return newFeature;
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
