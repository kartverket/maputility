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
    // this.features = new MapFeatures();
    this.db.load();
    // this.features.load();
    this.waypoints = [];
    this.route = null;
  }

  /**
  * Clears the origin, destination and the generated route data
  *
  * @this {Navigation}
  */
  clear() {
    this.route = null;
    this.waypoints = [];
  }

  /**
  * Sets a waypoint to use when generating a route
  *
  * @this {Navigation}
  * @param {Vector2} vec2
  * @return {number} index
  */
  addWaypoint(vec2) {
    this.waypoints.push(vec2);
    return this.waypoints.length - 1;
  }

  /**
  * Removes a waypoint
  *
  * @this {Navigation}
  * @param {number} index
  */
  removeWaypoint(index) {
    this.waypoints.splice(index, 1);
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
  }

  /**
  * Generates a route based on the previously set destination and origin coordinates
  *
  * @this {Navigation}
  * @param {requestCallback} call Callback, is called with (Error, coordinate[{x, y, index}])
  */
  calculate(call) {

    if(this.waypoints.length < 2) {
      call("Need atleast two waypoints to calculate a route!", null);
      return;
    }

    var route = new Route(), routeSegment = null;

    for(var i = 1; i < this.waypoints.length; i++) {
      routeSegment = this.calculateRouteSegment(this.waypoints[i - 1], this.waypoints[i]);
      if(routeSegment === null) {
        call("Could not calculate sub-route between waypoint " + i + " to " + (i + 1), null);
        return;
      }
      route.add(routeSegment);
    }

    call(null, route);
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
      var route = new RouteSegment(this.db, a, path, b);
      console.log("features", this.findInRoute(0.01, route));
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

}

export default Navigation;
