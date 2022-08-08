/**
 * @module DisplacedPoints
 */

import methodsPlacement from "./methodsPlacement";
import Cluster from "./Cluster";

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
  }
  
  /**
   * Handle the source changing.
   */
  refresh() {
    this.clear();
    this.cluster();
    // this.addFeatures(this.features);
  }
}

export default DisplacedPoints;
