/**
 * @module DisplacedPoints
 */

import VectorSource from "ol/source/Vector";
import EventType from "ol/events/EventType";

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

    this.updateDistance(this.distance, this.minDistance);
    this.setSource(options.source || null);
  }

  /**
   * Get a reference to the wrapped source.
   * @return {VectorSource|null} Source.
   * @api
   */
  getSource() {
    return this.source;
  }

  /**
   * Replace the wrapped source.
   * @param {VectorSource|null} source The new source for this instance.
   * @api
   */
  setSource(source) {
    if (this.source) {
      this.source.removeEventListener(EventType.CHANGE, this.boundRefresh_);
    }
    this.source = source;
    if (source) {
      source.addEventListener(EventType.CHANGE, this.boundRefresh_);
    }
    this.refresh();
  }

  /**
   * Get the distance in pixels between clusters.
   * @return {number} Distance.
   * @api
   */
  getDistance() {
    return this.distance;
  }

  /**
   * Set the distance within which features will be clusterd together.
   * @param {number} distance The distance in pixels.
   * @api
   */
  setDistance(distance) {
    this.updateDistance(distance, this.minDistance);
  }

  /**
   * The configured minimum distance between clusters.
   * @return {number} The minimum distance in pixels.
   * @api
   */
  getMinDistance() {
    return this.minDistance;
  }

  /**
   * Set the minimum distance between clusters. Will be capped at the
   * configured distance.
   * @param {number} minDistance The minimum distance in pixels.
   * @api
   */
  setMinDistance(minDistance) {
    this.updateDistance(this.distance, minDistance);
  }

  /**
   * Update the distances and refresh the source if necessary.
   * @param {number} distance The new distance.
   * @param {number} minDistance The new minimum distance.
   */
  updateDistance(distance, minDistance) {
    const ratio =
      distance === 0 ? 0 : Math.min(minDistance, distance) / distance;
    const changed =
      distance !== this.distance || this.interpolationRatio !== ratio;
    this.distance = distance;
    this.minDistance = minDistance;
    this.interpolationRatio = ratio;
    if (changed) {
      // this.refresh();
    }
  }
}

export default DisplacedPoints;
