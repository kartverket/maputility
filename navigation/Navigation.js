import GeoDB from "./GeoDB";
import MapFeatures from "./MapFeatures";
import AStarPathfinder from "./AStarPathfinder";
import RouteRenderer from "./RouteRenderer";
import Vector2 from "../vector/Vector2";
import Route from "./Route";
import RouteSegment from "./RouteSegment";
"use strict";

/**
* Navigation, Main navigation class
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
* @todo Test cases (Optimal route check)
* @todo finish heuristics function
* @todo Specify interface for pathfinding heuristics
* @todo Multithreaded processing (Interface for communicating between threads)
*/
class Navigation {

  /**
  * Creates a instance of the Navigation class
  *
  * @constructor
  * @this {Navigation}
  */
  constructor() {
    this.db = new GeoDB();
    this.features = new MapFeatures();
    this.db.load();
    this.features.load();
    this.waypoints = [];
    this.route = new Route();
  }

  /**
  * Clears the origin, destination and the generated route data
  *
  * @this {Navigation}
  */
  clear() {
    this.route.clear();
    this.waypoints = [];
  }

  /**
  * Sets a waypoint to use when generating a route
  *
  * @this {Navigation}
  * @param {Vector2} vec2
  * @return {number} index
  */
  pushWaypoint(vec2) {
    var len = this.waypoints.length;
    this.waypoints.push(vec2);

    if(len >= 1) {
      var segment = this.calculateRouteSegment(this.waypoints[len - 1], vec2);
      this.route.push(segment);
    }

    return len;
  }

  /**
  * Removes a waypoint from the end of the list and returns it
  *
  * @this {Navigation}
  * @return {Vector2}
  */
  popWaypoint() {
    var wp = this.waypoints.pop();
    if(this.waypoints.length !== 0) {
      this.route.pop();
    }
    return wp;
  }

  /**
  * Removes a waypoint
  *
  * @this {Navigation}
  * @param {number} val (Can also be Vector2, will then choose the closest waypoint)
  */
  removeWaypoint(val) {
    var index = typeof val === "number" ? val : this.findClosestWaypoint(val);
    this.waypoints.splice(index, 1);
    if(this.waypoints.length > 1) {
      this.route.remove(index - 1);
      if(index > 0 && index < this.waypoints.length) {
        var segment = this.calculateRouteSegment(this.waypoints[index - 1], this.waypoints[index]);
        this.route.set(index - 1, segment);
      }
    }
  }

  /**
  * Get a waypoint
  *
  * @this {Navigation}
  * @param {number}
  * @return {Vector2}
  */
  getWaypoint(index) {
    return this.waypoints[index];
  }

  /**
  * Get the waypoints used for navigation
  *
  * @this {Navigation}
  * @return {array} Array of Vector2 coordinates
  */
  getWaypoints() {
    return this.waypoints;
  }

  /**
  * Set the waypoints to use when generating a route
  *
  * @this {Navigation}
  * @param {array} arr Array of Vector2 coordinates
  */
  setWaypoints(arr) {
    this.waypoints = arr;
    this.calculate();
  }

  /**
  * Locate the set waypoint closest to a set of coordinates and return the index
  *
  * @this {Navigation}
  * @param {Vector2} vec2
  * @return {number}
  */
  findClosestWaypoint(vec2) {
    var min = Number.MAX_VALUE, dist = 0;
    var curr = -1, len = this.waypoints.length, i = 0;

    for(; i < len; i++) {
      dist = vec2.distance(this.waypoints[i]);
      if(dist < min) {
        min = dist;
        curr = i;
      }
    }

    return curr;
  }

  /**
  * Generates a route based on the previously set destination and origin coordinates
  *
  * @this {Navigation}
  * @return {Route}
  */
  calculate() {
    this.route.clear();
    var routeSegment = null, i = 1;
    for(; i < this.waypoints.length; i++) {
      routeSegment = this.calculateRouteSegment(this.waypoints[i - 1], this.waypoints[i]);
      route.add(routeSegment);
    }
  }

  /**
  * Calculate a route between two coordinates
  *
  * @this {Navigation}
  * @param {Vector2} from
  * @param {Vector2} to
  * @return {RouteSegment}
  */
  calculateRouteSegment(a, b) {

    var start = this.findClosestNode(a);
    var end = this.findClosestNode(b);

    if(start === null) {
      console.log("Could not locate origin node");
      return null;
    } else if(end === null) {
      console.log("could not locate destination");
      return null;
    } else {
      var astar = new AStarPathfinder(this.db);
      var path = astar.findShortestPath(start, end);
      console.log("PATH", path);
      var route = new RouteSegment(this.db, a, path, b);
      //console.log("features", this.findInRoute(0.01, route));
      return route;
    }
  }

  /**
  * Finds the closest point in the navmesh relative to the input coordinates
  *
  * @this {Navigation}
  * @param {Vector2} vec2
  * @return {Vertice}
  */
  findClosestNode(vec2) {
    return this.db.findClosestNode(vec2);
  }

  /**
  * Find data points along the route
  *
  * @this {Navigation}
  * @param {Route} route
  * @param {number} radius Distance from route to search
  * @param {requestCallback} call (err, result)
  */
  findInRoute(radius, route) {
    return this.features.findInRoute(radius, route.waypoints);
  }

  /**
  * Returns a route instance
  *
  * @this {Navigation}
  * @return {Route}
  */
  getRoute() {
    return this.route.clone();
  }

}

export default Navigation;
