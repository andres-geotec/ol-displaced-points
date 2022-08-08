import { Cluster } from "ol/source";

class DisplacedPoints extends Cluster {
  /**
   * @param {Options} options DisplacedPoints options.
   */
  constructor(options) {
    console.log("instancioansdo DisplacedPoints");
    super(options);

    /**
     * @type {number}
     * @protected
     */
     this.methodPlacement = methodsPlacement_[options.methodPlacement || "ring"];

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
