"use strict";

/**
* Class representing a route
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Route {

  /**
  * Creates a instance of a Route
  *
  * @constructor
  * @this {Route}
  */
  constructor() {
    this.segments = [];
  }

  /**
  * Add a segment to the route
  *
  * @this {Route}
  * @param {RouteSegment}
  */
  add(segment) {
    this.segments.push(segment);
  }

  /**
  * Get the segment associated by the index
  *
  * @this {Route}
  * @param {number} index
  * @return {RouteSegment} segment
  */
  get(index) {
    return this.segments[i];
  }

  /**
  * Calculates the total distance of the route in km
  *
  * @this {Route}
  * @return {number} distance
  */
  distance() {
    var result = 0, i = 0;
    for(; i < this.length(); i++) {
      result += this.segments[i].distance();
    }
    return result;
  }

  /**
  * Get the amount of segments in the route
  *
  * @this {Route}
  * @return {number} number of segments
  */
  length() {
    return this.segments.length;
  }

  /**
  * Get a array of mapbox annotations representing this route
  *
  * @this {Route}
  * @return {array} Array of mapbox annotations representing this route
  */
  render() {
    var result = [], i = 0;
    for(; i < this.length(); i++) {
      result.push(this.segments[i].render("main_"+i));
    }

    return result;
  }
}


export default Route;
