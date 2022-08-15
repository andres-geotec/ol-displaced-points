/**
 * @module Circle
 */

/**
 * @typedef {Object} Options
 * @property {number} circumference The boundary of the circle is known as the circumference
 * @property {number} radius The line from the centre “O” of the circle to the circumference
 * of the circle is called the radius and it is denoted by “R” or “r”
 * @property {number} diameter The line that passes through the centre of the circle and
 * touches the two points on the circumference is called the diameter and it is denoted by the
 * symbol “D” or “d”
 * @property {number} arc Arc is the part of the circumference where the largest arc is
 * called the major arc and the smaller one is called the minor arc
 * @property {number} sector Sector is slice of a circle bounded by two radii and the
 * included arc of a circle
 * @property {number} chord The straight line that joins any two points on the circumference
 * of a circle is called the chord
 * @property {number} tangent A line that touches the circumference of a circle at a point is
 * called the tangent
 * @property {number} secant A line that cuts the circle at the two distinct points is known
 * as the secant
 */

/**
 * @classdesc
 * Description class here.
 */
class Circle {
  /**
   * @param {Options} options Circle options.
   */
  constructor(options) {
    /**
     * @private
     */
    this.properties = options;
  }

  /**
   *
   */
  get circumference() {
    if (this.properties.circumference) return this.properties.circumference;

    if (this.properties.radius) {
      return circumferenceFromRadius(this.properties.radius);
    }

    if (this.properties.diameter) {
      return circumferenceFromDiameter(this.properties.diameter);
    }

    return undefined;
  }

  /**
   *
   */
  set circumference(circumference) {
    this.properties.circumference = circumference;
  }

  /**
   *
   */
  get radius() {
    if (this.properties.radius) return this.properties.radius;

    if (this.properties.circumference) {
      return radiusFromCircumference(this.properties.circumference);
    }

    if (this.properties.diameter) {
      return radiusFromDiameter(this.properties.diameter);
    }

    return undefined;
  }

  /**
   *
   */
  set radius(radius) {
    this.properties.radius = radius;
  }

  /**
   *
   */
  get diameter() {
    if (this.properties.diameter) return this.properties.diameter;

    if (this.properties.circumference) {
      return diameterFromCircumference(this.properties.circumference);
    }

    if (this.properties.radius) {
      return diameterFromRadius(this.properties.radius);
    }
  }

  /**
   *
   */
  set diameter(diameter) {
    this.properties.diameter = diameter;
  }

  get area() {
    return Math.PI * Math.pow(this.radius, 2);
  }
}

export default Circle;

export function circumferenceFromRadius(radius) {
  return circumferenceFromDiameter(2 * radius);
}

export function circumferenceFromDiameter(diameter) {
  return Math.PI * diameter;
}

export function radiusFromCircumference(circumference) {
  return radiusFromDiameter(diameterFromCircumference(circumference));
}

export function radiusFromDiameter(diameter) {
  return diameter / 2;
}

export function diameterFromCircumference(circumference) {
  return circumference / Math.PI;
}

export function diameterFromRadius(radius) {
  return radius * 2;
}
