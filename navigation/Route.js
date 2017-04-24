import RouteRenderer from "./RouteRenderer";
import Vector2 from "../vector/Vector2";
import Waypoint from "../vector/Waypoint";
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
  constructor(waypoints) {
    this.waypoints = waypoints;
    this.segments = [];
    this.path = [];
    this.renderer = new RouteRenderer();
    this.renderer.setWidth(2);
    this.renderer.setAlpha(1);
    this.prerender = null;
  }

  /**
  * Updates the path data
  *
  * @this {Route}
  */
  update() {
    let arr = [], i = 0, len = this.segments.length;
    for(; i < len; i++) {
      arr = arr.concat(this.segments[i].list());
    }
    this.path = this.completeRoute(arr);
  }

  /**
  * Get the fairway waypoints from the route
  *
  * @this {Route}
  * @return {array} [waypoints]
  */
  getFairways() {
    var arr = [], len = this.segments.length, i = 0;
    for(; i < len; i++) {
      arr = arr.concat(this.segments[i].path);
    }
    return arr;
  }

  /**
  * Complete the route
  *
  * @this {Route}
  * @return {array}
  */
  completeRoute(arr) {
    var start = this.waypoints[0];
    var end = this.waypoints[this.waypoints.length - 1];
    var result = [start];
    var len = arr.length;

    if(arr.length > 2) {
      result.push(
        this.findOptimalIntersection(
          start,
          arr[0],
          arr[1]
        )
      );
    }

    for(var i = 2; i < len - 2; i++) {
      if(!arr[i].equals(arr[i - 1])) { // TODO Hacky, make it better
        result.push(arr[i]);
      }
    }

    if(arr.length > 2) {
      result.push(
        this.findOptimalIntersection(
          end,
          arr[len - 2],
          arr[len - 1]
        )
      );
    }

    result.push(end);
    return this.cardinalSplineInterpolation(result);
  }

  /**
  * Locate the closest point in the line ab to the point p
  *
  * @this {Route}
  * @param {Vector2} p
  * @param {Vector2} a
  * @param {Vector2} b
  * @return {Vector2}
  */
  findOptimalIntersection(p, a, b) {
    var ab = new Vector2(0,0);
    var ap = new Vector2(0,0);
    b.sub(a, ab);
    p.sub(a, ap);

    var ab2 = ab.x*ab.x + ab.y*ab.y;
    var apab = ap.x*ab.x + ap.y*ab.y;
    var t = apab / ab2;

    if(t <= 0) {
      return b;
    }else if(t > 1 || isNaN(t)) {
      return a;
    }

    ab.mulScalar(t, ab);
    ab.add(a, ab);
    var nwp = new Waypoint(ab.x, ab.y);
    nwp.setClearance(b.getClearance());
    return nwp;
  }

  /**
  * Perform cardinaal spline interpolation of the abstracted route
  *
  * @this {Route}
  * @param {array} arr Array of Vector2 coordinates
  * @param {array} Array of Vector2 coordinates
  */
  cardinalSplineInterpolation(arr) {
    var len = arr.length - 2, i = 1, t = 0;
    var resolution = 3, tension = 0.25;
    var t1 = new Vector2(0, 0);
    var t2 = new Vector2(0, 0);
    var st = 0, st2 = 0, st3 = 0;
    var c1 = 0, c2 = 0, c3 = 0, c4 = 0;
    var c1r = [], c2r = [], c3r = [], c4r = [];
    var result = [arr[0]], nwp = null;

    for(t = 0; t <= resolution; t++) {
      st = t / resolution;
      st2 = st * st;
      st3 = st2 * st;
      c1r.push((2 * st3) - (3 * st2) + 1)
      c2r.push((-2 * st3) + (3 * st2))
      c3r.push(st3 - (2 * st2) + st);
      c4r.push(st3 - st2);
    }

    for(; i < len; i++) {

      t1.set(
        (arr[i + 1].x - arr[i - 1].x) * tension,
        (arr[i + 1].y - arr[i - 1].y) * tension
      );
      t2.set(
        (arr[i + 2].x - arr[i].x) * tension,
        (arr[i + 2].y - arr[i].y) * tension
      );
      for(t = 0; t <= resolution; t++) {
        c1 = c1r[t];
        c2 = c2r[t];
        c3 = c3r[t];
        c4 = c4r[t];

        nwp = new Waypoint(
          (c1 * arr[i].x) + (c2 * arr[i+1].x) + (c3 * t1.x) + (c4 * t2.x),
          (c1 * arr[i].y) + (c2 * arr[i+1].y) + (c3 * t1.y) + (c4 * t2.y)
        );
        nwp.setClearance(arr[i].getClearance());
        result.push(nwp);
      }
    }

    result.push(arr[arr.length - 1]);
    return result;
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
  * Calculate the total distance of the route
  *
  * @this {Route}
  * @return {number} Distance in kilometers
  */
  distance() {
    var i = 1, len = this.path.length, result = 0;
    for(; i < len; i++) {
      result += this.path[i-1].geographicDistance(this.path[i]);
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
  render(id, db) {

    if(this.prerender === null) {
      this.prerender = [
        this.renderer.renderPolygon("route_polygon_" + id, this.path),
        this.renderer.render("route_line_" + id, this.path)
      ];
    }

    return this.prerender;
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
