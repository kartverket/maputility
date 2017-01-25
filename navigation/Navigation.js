import GeoDB from "./GeoDB";
import MapFeatures from "./MapFeatures";
import AStarPathfinder from "./AStarPathfinder";
import RouteRenderer from "./RouteRenderer";
import Vector2 from "../vector/Vector2";
import Route from "./Route";
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
    this.origin = null;
    this.destination = null;
    this.route = null;
  }

  /**
  * Clears the origin, destination and the generated route data
  *
  * @this {Navigation}
  */
  clear() {
    this.origin = null;
    this.destination = null;
    this.route = null;
  }

  /**
  * Sets the origin coordinate of a route
  *
  * @this {Navigation}
  * @param {Vector2} vec2
  */
  setOrigin(vec2) {
    this.origin = vec2;
    var test = this.findClosestNode(vec2);
  }

  /**
  * Gets the origin coordinates
  *
  * @this {Navigation}
  * @return {Vector2}
  */
  getOrigin() {
    return this.origin.clone();
  }

  /**
  * Sets the destination coordinate of a route
  *
  * @this {Navigation}
  * @param {Vector2} vec2
  */
  setDestination(vec2) {
    this.destination = vec2;
  }

  /**
  * Gets the destination coordinates
  *
  * @this {Navigation}
  * @return {Vector2}
  */
  getDestination() {
    return this.destination.clone();
  }

  /**
  * Generates a route based on the previously set destination and origin coordinates
  *
  * @this {Navigation}
  * @param {requestCallback} call Callback, is called with (Error, coordinate[{x, y, index}])
  */
  calculate(call) {

    if(this.origin === null || this.destination === null) {
      call("Destination or Origin not set!", null);
      return;
    }

    var start = this.findClosestNode(this.origin);
    var end = this.findClosestNode(this.destination);

    if(start === null) {
      call("Could not locate origin node", null);
    } else if(end === null) {
      console.log("could not locate destination");
      call("Could not locate end node", null);
    } else {
      var astar = new AStarPathfinder(this.db);
      var path = astar.findShortestPath(start, end);
      var route = new Route(this.db, this.getOrigin(), path, this.getDestination());
      console.log("features", this.findInRoute(0.01, route));
      call(null, route);
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
