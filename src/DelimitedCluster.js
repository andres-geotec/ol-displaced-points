/**
 * @module DelimitedCluster
 */

import { buffer, createEmpty, createOrUpdateFromCoordinate } from "ol/extent";
import Cluster from "ol/source/Cluster.js";
import { getUid } from "ol/util";

/**
 * @typedef {Object} Options
 * @property {string} [delimiterField] Field to delimit clusters.
 */

/**
 * @classdesc
 * Desc.
 * @api
 * @extends {Cluster<Feature<import("ol/geom/Geometry.js").default>>}
 */
class DelimitedCluster extends Cluster {
  /**
   * @param {Options<FeatureType>} [options] Cluster options.
   */
  constructor(options) {
    super(options);

    /**
     * @type {string|undefined}
     * @protected
     */
    this.delimiterField = options.delimiterField;
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

    const delimiterField = this.delimiterField;
    var delimitations = [];
    features.forEach((f) => {
      const type = f.get(delimiterField);
      if (!delimitations.includes(type)) delimitations.push(type);
    });

    /** @type {Object<string, true>} */
    const clustered = {};

    delimitations.forEach(delimitation => {
      features.forEach(feature => {
        if (!(getUid(feature) in clustered)) {
          const geometry = this.geometryFunction(feature);
          if (geometry) {
            const coordinates = geometry.getCoordinates();
            createOrUpdateFromCoordinate(coordinates, extent);
            buffer(extent, mapDistance, extent);

            const neighbors = this.source
              .getFeaturesInExtent(extent)
              .filter(neighbor => {
                const uid = getUid(neighbor);
                if (uid in clustered || neighbor.get(delimiterField) !== delimitation) {
                  return false;
                }
                clustered[uid] = true;
                return true
              });
            this.features.push(this.createCluster(neighbors, extent));
          }
        }
      });
    });
  }
}

export default DelimitedCluster;
