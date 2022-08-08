/**
 * @module DisplacedPoints
 */

import VectorSource from "ol/source/Vector.js";

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
  }
}

export default DisplacedPoints;
