const {Position} = require('./position');

/**
 * A Ping represents a vehicle's position at a given timestamp
 */
class Ping {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} timestamp Timestamp of the ping, in seconds since epoch.
   */
  constructor(x, y, timestamp) {
    /** @private @const {!Position} */
    this.position = new Position(x, y);

    /** @private @const */
    this.timestamp = timestamp;
  }

  /** @return {!Position} */
  getPosition() {
    return this.position;
  }

  /** @return {number} */
  getTimestamp() {
    return this.timestamp;
  }

  /**
   * The difference between the timestamps of the pings, in seconds. The
   * result is positive if ping1 is earlier than ping2.
   * @param {!Ping} ping1
   * @param {!Ping} ping2
   * @return {number}
   */
  static secondsBetween(ping1, ping2) {
    return ping2.getTimestamp() - ping1.getTimestamp();
  }
}

module.exports = {Ping};
