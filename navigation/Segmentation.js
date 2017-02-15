import Vector2 from "../vector/Vector2";
"use strict";

/**
* Class representing a route segmentation
* @author Leif Andreas Rudlang
* @version 0.0.3
* @since 0.0.3
*/
class Segmentation {

  /**
  * Create a instance of segmentation
  *
  * @constructor
  * @this {Segmentation}
  * @param {number} route Route index
  * @param {number} segment Segment index
  * @param {array} waypoints Waypoint array to manipulate
  */
  constructor(route, segment, waypoints) {
    this.route = route;
    this.segment = segment;
    this.waypoints = waypoints;
    this.position = new Vector2(0, 0);
    this.alive = false;
    this.make();
  }

  /**
  * Set the position to segment through
  *
  * @this {Segmentation}
  * @param {number} x
  * @param {number} y
  */
  setPosition(x, y) {
    this.position.set(x, y);
  }

  /**
  * Destroy the segmentation, return the route to its original state
  *
  * @this {Segmentation}
  */
  destroy() {
    if(this.alive) {
      this.waypoints.splice(this.segment, 1);
      this.alive = false;
    }
  }

  /**
  * Make the segmentation, will revive the segmentation if destroyed
  *
  * @this {Segmentation}
  */
  make() {
    if(!this.alive) {
      this.waypoints.splice(this.segment, 0, this.position);
      this.alive = true;
    }
  }
}


export default Segmentation;
