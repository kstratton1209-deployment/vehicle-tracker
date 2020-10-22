const {Ping} = require('./ping');
const {Position} = require('./position');

/**
 * A named vehicle with a sequence of pings.
 */
class Vehicle {
  /**
   * @param {string} name
   */
  constructor(name) {
    /** @private @const */
    this.name = name;

    /** @private @const {!Array<!Ping>} */
    this.pings = [];

  }

  /**
   * The name of the vehicle.
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * The pings for the vehicle, in chronological order (earliest first).
   * @return {!Array<!Ping>}
   */
  getPings() {
    return this.pings;
  }

  /**
   * Determines the total distance covered by the pings.
   * @param {!Array<!Ping>} pings
   * @return {number}
   */
  static getTotalDistance(pings, timesince = 0) {
    
    let totalDistance = 0;

    if (pings.length == 1 || pings.length == 0) {
      return 0;
    }

    for (let i = 0; i < pings.length -1; i++) {
      if (pings[i].timestamp >= timesince) {
        totalDistance += Position.getDistance(pings[i+1].getPosition(), pings[i].getPosition())
      }
    }  
    
    return totalDistance;
    
  }

  /**
   * Determines the total distance traveled by the vehicle.
   * @return {number}
   */
  getTotalDistance() {
    return Vehicle.getTotalDistance(this.pings);
  }

  /**
   * Determines the average speed of the vehicle.
   * @return {number}
   */
  getAverageSpeed() {

    let numPings = this.pings.length;

    if (numPings <= 1) {
      return 0;
    }
   
    else {
      let avgSpeed = this.getTotalDistance() / (this.pings[numPings-1].timestamp - this.pings[0].timestamp)
      return avgSpeed.toFixed(4);
    }
    
  }

  static getVelocity(pings) {
    
    let velocityOfPings = []

    if (pings.length <= 1) {
      return 0;
    }

    for (let i = 0; i < pings.length - 2; i++) {
      velocityOfPings.push(
        Position.getDistance(pings[i+1].getPosition(), pings[i].getPosition())/
        (Ping.secondsBetween(pings[i],pings[i+1]))
        )
    }  
    
    return velocityOfPings;
    
  }

  /**
   * Determines the veloicty of vehicle between pings.
   * @return {numer}
   */
  getVelocity() {
    return Vehicle.getVelocity(this.pings);
  }

}

module.exports = {Vehicle};
