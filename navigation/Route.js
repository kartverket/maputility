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
    this.renderer.setWidth(5);
    this.renderer.setAlpha(1);
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

  /**
  * Set a route segment at the input index
  *
  * @this {Route}
  * @param {number} index
  * @param {RouteSegment}
  */
  set(index, segment) {
    this.segments[index] = segment;
  }

  /**
  * Pop a segement from the route and return it
  *
  * @this {Route}
  * @return {RouteSegment}
  */
  pop() {
    return this.segments.pop();
  }

  /**
  * Return and remove a route segment from the input index
  *
  * @this {Route}
  * @param {number} index
  * @return {RouteSegment}
  */
  remove(index) {
    return this.segments.splice(index, 1);
  }

  /**
  * Clear route
  *
  * @this {Route}
  */
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
    var i = 0, j = 0, len = 0, arr = null, result = [];

    if(this.segments.length === 0) {
      return [this.renderer.render("route_polygon", []), this.renderer.render("route_line", [])];
    }

    for(var i = 0; i < this.segments.length; i++) {
      arr = this.segments[i].render();
      len = arr.length - 1;
      for(j = 0; j < len; j++) {
        result.push(arr[j]);;
      }
    }

    result.push(arr[len]);
    return [this.renderer.renderPolygon("route_polygon", result), this.renderer.render("route_line", result)];
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

  /**
  * Get the renderer object representing the route
  *
  * @this {Route}
  * @return {RouteRenderer}
  */
  getRenderer() {
    return this.renderer;
  }

}


export default Route;
