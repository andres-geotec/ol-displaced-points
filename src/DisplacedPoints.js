/**
 * @module DisplacedPoints
 */

import VectorSource from "ol/source/Vector";

import methodsPlacement from "./methodsPlacement";

class DisplacedPoints extends VectorSource {
  /**
   * @param {Options} options DisplacedPoints options.
   */
  constructor(options) {
    console.log("instancioansdo DisplacedPoints");
    super({
      attributions: options.attributions,
      wrapX: options.wrapX,
    });

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

    /**
     * @type {number|undefined}
     * @protected
     */
    this.resolution = undefined;

    /**
     * @type {number}
     * @protected
     */
    this.distance = options.distance !== undefined ? options.distance : 20;

    /**
     * @type {number}
     * @protected
     */
    this.minDistance = options.minDistance || 0;

    /**
     * @type {number}
     * @protected
     */
    this.interpolationRatio = 0;

    /**
     * @type {Array<Feature>}
     * @protected
     */
    this.features = [];

    /**
     * @param {Feature} feature Feature.
     * @return {Point} Cluster calculation point.
     * @protected
     */
    this.geometryFunction =
      options.geometryFunction ||
      function (feature) {
        const geometry = /** @type {Point} */ (feature.getGeometry());
        assert(geometry.getType() == "Point", 10); // The default `geometryFunction` can only handle `Point` geometries
        return geometry;
      };

    /**
     * @type {function(Point, Array<Feature>):Feature}
     * @private
     */
    this.createCustomCluster_ = options.createCluster;

    /**
     * @type {VectorSource|null}
     * @protected
     */
    this.source = null;

    /**
     * @private
     */
    this.boundRefresh_ = this.refresh.bind(this);

    // this.updateDistance(this.distance, this.minDistance);
    // this.setSource(options.source || null);
  }
}

export default DisplacedPoints;
