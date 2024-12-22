/**
 * @module TrigonometricRatios
 */

/**
 * Se crea un triangulo rectángulo imaginario en el que la hipotenusa es el radio, asi que
 * sin = altura del triangulo
 * cos = ancho del triangulo
 *
 * en este caso como queremos que el primer punto se posicione arriba del baricentro:
 * sin = ancho del triangulo (+ coordenada x)
 * cos = altura del triangulo (+ coordenada y)
 */

/**
 * @typedef {Object} Options
 * @property {number} [radianAngle=1] Desc.
 * @property {number} [radius=1] Desc.
 * @property {Array<number>} [centerO=[0,0]] Desc.
 */

/**
 * @classdesc
 *
 * referencia: https://es.wikipedia.org/wiki/Trigonometr%C3%ADa#Sentido_de_las_funciones_trigonom%C3%A9tricas
 * img: https://upload.wikimedia.org/wikipedia/commons/8/86/Trigonometria_02.svg
 * interactivo: https://www.geogebra.org/m/fWTB4CxY
 */
class TrigonometricRatios {
  /**
   * @param {Options} options TrigonometricRatios options.
   */
  constructor(options) {
    this.center = options.centerO || [0, 0];

    /**
     * @type {number}
     * @public
     */
    this.radianAngle = options.radianAngle ?? 1;

    /**
     * @type {number}
     * @public
     */
    this.radius = options.radius || 1;
  }

  /**
   * @returns
   */
  get sideAdjacent() {
    return Math.cos(this.radianAngle) * this.radius;
  }

  /**
   * @returns
   */
  get sideOpposite() {
    return Math.sin(this.radianAngle) * this.radius;
  }

  /**
   * @returns
   */
  get sides() {
    return [this.sideAdjacent, this.sideOpposite];
  }

  /**
   * @returns
   */
  get hypotenuse() {
    return this.radius;
  }

  get tan() {
    return Math.tan(this.radianAngle) * this.radius;
  }
}

export default TrigonometricRatios;

/**
 *
 */
export const TAU = 2 * Math.PI;

class Point {
  constructor(x_orCoords, y) {
    if (Array.isArray(x_orCoords)) {
      this.x = x_orCoords[0];
      this.y = x_orCoords[1];
    } else if (x_orCoords.x !== undefined && x_orCoords.y !== undefined) {
      this.x = x_orCoords.x;
      this.y = x_orCoords.y;
    } else {
      this.x = x_orCoords;
      this.y = y;
    }

    this.validate();
  }

  get array() {
    return [this.x, this.y];
  }

  get object() {
    return { x: this.x, y: this.y };
  }

  validate() {}
}

class Side {
  constructor(pointA_orPoints, pointB) {
    if (Array.isArray(pointA_orPoints) && pointB === undefined) {
      this.pointA = new Point(pointA_orPoints[0]);
      this.pointB = new Point(pointA_orPoints[1]);
    } else if (
      pointA_orPoints.a !== undefined &&
      pointA_orPoints.b !== undefined
    ) {
      this.pointA = new Point(pointA_orPoints.a);
      this.pointB = new Point(pointA_orPoints.b);
    } else {
      this.pointA = new Point(pointA_orPoints);
      this.pointB = new Point(pointB);
    }

    this.distance = this.calculateDistace();
  }

  calculateDistace() {
    return Math.sqrt(
      Math.pow(this.pointB.x - this.pointA.x) +
        Math.pow(this.pointB.y - this.pointA.y)
    );
  }
}

class Angle {
  constructor(measure) {
    this.measure = measure;
  }

  toSexagesimalDegrees() {
    return (this.measure * 180) / Math.PI;
  }

  toRadians() {
    return (this.measure * Math.PI) / 180;
  }
}
