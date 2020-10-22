/**
 * A Position represents an x, y coordinate in a given warehouse. Position
 * can be used to determine how far apart or near together two vehicles are.
 */
class Position {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    /** @private @const */
    this.x = x;

    /** @private @const */
    this.y = y;
  }

  /** @return {number} */
  getX() {
    return this.x;
  }

  /** @return {number} */
  getY() {
    return this.y;
  }

  /**
   * @param {*} obj
   * @return {boolean}
   */
  equals(obj) {
    if (!(obj instanceof Position)) return false;
    return (this.x == obj.getX() && this.y == obj.getY());
  }

  /**
   * Determines the distance between two Positions
   * Distance is calculated as the Euclidean distance in two dimensions
   * https://en.wikipedia.org/wiki/Euclidean_distance
   * @param {Position} position1
   * @param {Position} position2
   */
  static getDistance(position1, position2) {
    const xDiff = Math.abs(position1.getX() - position2.getX());
    const yDiff = Math.abs(position1.getY() - position2.getY());

    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  }
}

module.exports = {Position};
