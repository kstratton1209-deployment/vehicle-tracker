const fs = require('fs');
const readline = require('readline');
const {Ping} = require('./ping');
const {Vehicle} = require('./vehicle');
const {Position} = require('./position');


class WarehouseServer {
  constructor() {
    /** @const @private {!Array<Vehicle>} A list of vehicle instances. */
    this.vehicles = [];
  }

  /**
   * Returns an object mapping vehicle name to that vehicle's average speed for
   * all vehicles.
   * @return {!Object<string, number>}
   */
  getAverageSpeeds() {
    return this.vehicles.reduce((acc, vehicle) => {
      acc[vehicle.getName()] = vehicle.getAverageSpeed();
      return acc;
    }, {});
  }

  getTotalDistances() {
    return this.vehicles.reduce((dist, vehicle) => {
      dist[vehicle.getName()] = vehicle.getTotalDistance();
      return dist;
    }, {});
  }

  getVelocities() {
    return this.vehicles.reduce((velo, vehicle) => {
      velo[vehicle.getName()] = vehicle.getVelocity();
      return velo;
    }, {});
  }

    /**
   * Returns an array of velocities which are outside of 1 standard deviations from the mean. 
   * 1 standard deviation from mean accounts for about 70% of set.
   * @param  {!Array<number>} velocities
   * @return {!Array<number>}
   */
  findOutliers(velocities) {
    let l = velocities.length;
    let sum = 0;    
    let sumsq = 0; 
    for (let i = 0; i< velocities.length; i++) {
      for(var j = 0; j < velocities[i].length; j++) {
        sum += velocities[i][j];
        sumsq += velocities[i][j] * velocities[i][j];
      }
    }
    let mean = sum / l; 
    let variance = sumsq / l - mean * mean;
    let sd = Math.sqrt(variance);
    let outlierVelocities = new Array(); 
    for(var i = 0; i < velocities.length; i++) {
      for(var j = 0; j < velocities[i].length; j++) {
        if(velocities[i][j] < mean - 1 * sd || velocities[i][j] > mean + 1 * sd )
        outlierVelocities.push(velocities[i]);
      }
    }
    return outlierVelocities;
  }

  /**
   * Returns a sorted array of size maxResults of vehicle names corresponding
   * to the vehicles that have traveled the most distance since the given
   * timestamp (in seconds).
   * @param {number} maxResults
   * @param {number} timestamp
   * @return {!Array<string>}
   */
  getMostTraveledSince(maxResults, timestamp) {
  
    let forkliftsMap = new Map()

    for (let i = 0; i < this.vehicles.length; i++){
      forkliftsMap.set(this.vehicles[i].getName(), this.vehicles[i].getTotalDistance())
    }

    const sortedMap = new Map([...forkliftsMap.entries()].sort((a, b) => b[1] - a[1]));

    let results = Array.from(sortedMap.keys())

    return results.slice(0, maxResults);
  }

  /**
   * Returns an array of names identifying vehicles that might have been
   * damaged through outliers in velocity
   * @return {!Array<string>}
   */
  checkForDamage() {
    
    let velocityMap = new Map();
    let outlierForklifts = []

    for (let i = 0; i < this.vehicles.length; i++){
      velocityMap.set(this.vehicles[i].getVelocity(),this.vehicles[i].getName())
    }

    let velocityArray = Array.from(velocityMap.keys())

    let outlierVelocities = this.findOutliers(velocityArray)

    if (outlierVelocities.length == 0 ) {
      return 0
    }

    else {
      for (let i = 0; i < outlierVelocities.length; i ++) {
        outlierForklifts.push(velocityMap.get(outlierVelocities[i]))
      }
      //remove duplicates
      let outliers = [...new Set(outlierForklifts)]
      return outliers;
    }
  }

  /**
   * @param {string} fileName
   * @return {!Promise<void>}
   */
  initializeServer(fileName) {
    return new Promise(resolve => {
      const reader = readline.createInterface({
        input: fs.createReadStream(fileName),
      });
      reader.on('line', line => {
        const [name, x, y, timestamp] = line.split(',');
        this.processPing(name, x, y, timestamp);
      });
      reader.on('close', resolve);
    });
  }

  /**
   * @param {string} vehicleName
   * @param {number} x
   * @param {number} y
   * @param {number} timestamp
   */
  processPing(vehicleName, x, y, timestamp) {
    const ping = new Ping(x, y, timestamp);
    if (!this.vehicles.some(vehicle => vehicle.getName() === vehicleName)) {
      this.vehicles.push(new Vehicle(vehicleName));
    }
    this.vehicles[this.vehicles.length - 1].getPings().push(ping);
  }
}

module.exports = {WarehouseServer};
