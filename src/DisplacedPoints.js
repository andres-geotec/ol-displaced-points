/**
 * @module DisplacedPoints
 */

import VectorSource from "ol/source/Vector";
import EventType from "ol/events/EventType";
import {
  createEmpty,
  createOrUpdateFromCoordinate,
  buffer,
  getCenter,
} from "ol/extent";
import { getUid } from "ol/util";
import { assert } from "ol/asserts";
import { add as addCoordinate, scale as scaleCoordinate } from "ol/coordinate";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";

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
      this.refresh();
    }
  }

  /**
   * @param {import("ol/extent").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {import("ol/proj/Projection").default} projection Projection.
   */
  loadFeatures(extent, resolution, projection) {
    this.source.loadFeatures(extent, resolution, projection);
    if (resolution !== this.resolution) {
      this.resolution = resolution;
      this.refresh();
    }
  }

  /**
   * Handle the source changing.
   */
  refresh() {
    this.clear();
    this.cluster();
    this.addFeatures(this.features);
  }

  /**
   * @protected
   */
  cluster() {
    if (this.resolution === undefined || !this.source) {
      return;
    }
    const extent = createEmpty();
    const mapDistance = this.distance * this.resolution;
    const features = this.source.getFeatures();

    /** @type {Object<string, true>} */
    const clustered = {};

    for (let i = 0, ii = features.length; i < ii; i++) {
      const feature = features[i];
      if (!(getUid(feature) in clustered)) {
        const geometry = this.geometryFunction(feature);
        if (geometry) {
          const coordinates = geometry.getCoordinates();
          createOrUpdateFromCoordinate(coordinates, extent);
          buffer(extent, mapDistance, extent);

          const neighbors = this.source
            .getFeaturesInExtent(extent)
            .filter(function (neighbor) {
              const uid = getUid(neighbor);
              if (uid in clustered) {
                return false;
              }
              clustered[uid] = true;
              return true;
            });
          this.features.push(this.createCluster(neighbors, extent));
        }
      }
    }
  }

  /**
   * @param {Array<Feature>} features Features
   * @param {import("ol/extent").Extent} extent The searched extent for these features.
   * @return {Feature} The cluster feature.
   * @protected
   */
  createCluster(features, extent) {
    const centroid = [0, 0];
    for (let i = features.length - 1; i >= 0; --i) {
      const geometry = this.geometryFunction(features[i]);
      if (geometry) {
        addCoordinate(centroid, geometry.getCoordinates());
      } else {
        features.splice(i, 1);
      }
    }
    scaleCoordinate(centroid, 1 / features.length);
    const searchCenter = getCenter(extent);
    const ratio = this.interpolationRatio;

    return this.createFeatureCluster(
      new Point([
        centroid[0] * (1 - ratio) + searchCenter[0] * ratio,
        centroid[1] * (1 - ratio) + searchCenter[1] * ratio,
      ]),
      features
    );
  }

  /**
   * @protected
   */
  createFeatureCluster(geometry, features) {
    if (this.createCustomCluster_) {
      return this.createCustomCluster_(geometry, features);
    }
    return new Feature({
      geometry,
      features,
    });
  }

  /**
   * Remove all features from the source.
   * @param {boolean} [opt_fast] Skip dispatching of {@link module:ol/source/VectorEventType~VectorEventType#removefeature} events.
   * @api
   */
  clear(opt_fast) {
    this.features.length = 0;
    super.clear(opt_fast);
  }
}

export default DisplacedPoints;
