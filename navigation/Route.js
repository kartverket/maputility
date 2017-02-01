import RouteRenderer from "./RouteRenderer";
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
    this.renderer = new RouteRenderer();
    this.renderer.setWidth(10);
    this.renderer.setAlpha(0.5);
    this.segments = [];
  }

  /**
  * Add a segment to the route
  *
  * @this {Route}
  * @param {RouteSegment}
  */
  push(segment) {
    this.segments.push(segment);
  }

  set(index, segment) {
    this.segments[index] = segment;
  }

  pop() {
    return this.segments.pop();
  }

  remove(index) {
    return this.segments.splice(index, 1);
  }

  clear() {
    this.segments = [];
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
    var i = 0, j = 0, arr = null, result = [];

    for(var i = 0; i < this.segments.length; i++) {
      arr = this.segments[i].render();
      for(j = 0; j < arr.length; j++) {
        result.push(arr[j].toArray());
      }
    }

    return this.renderer.render("route", result);
  }

  /**
  * Check if this route object has anything to render
  *
  * @this {Route}
  * @return {boolean}
  */
  isEmpty() {
    return this.segments.length === 0;
  }

  /**
  * Clones this route instance
  *
  * @this {Route}
  * @return {Route}
  */
  clone() {
    var r = new Route();
    for(var i = 0; i < this.segments.length; i++) {
      r.push(this.segments[i].clone());
    }
    return r;
  }
}


export default Route;
