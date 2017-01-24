import GeoDB from "./GeoDB";
import AStarPathfinder from "./AStarPathfinder";
import RouteRenderer from "./RouteRenderer";
import Vector2 from "../vector/Vector2";
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
    this.db.load();
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
  * @param {number} x X coordinate
  * @param {number} y Y coordinate
  */
  setOrigin(x, y) {
    this.origin = new Vector2(x, y);
    var test = this.findClosestNode(this.origin.x, this.origin.y);
    console.log("node", test);
  }

  /**
  * Gets the origin coordinates
  *
  * @this {Navigation}
  * @return {Vector2}
  */
  getOrigin(x, y) {
    return this.origin;
  }

  /**
  * Sets the destination coordinate of a route
  *
  * @this {Navigation}
  * @param {number} x X coordinate
  * @param {number} y Y coordinate
  */
  setDestination(x, y) {
    this.destination = new Vector2(x, y);
  }

  /**
  * Gets the destination coordinates
  *
  * @this {Navigation}
  * @return {Vector2}
  */
  getDestination(x, y) {
    return this.destination;
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

    var start = this.findClosestNode(this.origin.x, this.origin.y);
    var end = this.findClosestNode(this.destination.x, this.destination.y);

    if(start === null) {
      call("Could not locate origin node", null);
    } else if(end === null) {
      console.log("could not locate destination");
      call("Could not locate end node", null);
    } else {
      var astar = new AStarPathfinder(this.db);
      var route = astar.findShortestPath(start, end);
      call(null, route);
    }
  }

  /**
  * Finds the closest point in the navmesh relative to the input coordinates
  *
  * @this {Navigation}
  * @param {number} x X coordinate
  * @param {number} y Y coordinate
  * @return {array} [x, y] coordinate
  */
  findClosestNode(x, y) {
    return this.db.findClosestNode(x, y);
  }

  /**
  * Creates a new route renderer
  *
  * @this {Navigation}
  * @return {RouteRenderer}
  */
  makeRouteRenderer() {
    return new RouteRenderer(this.db);
  }
}

export default Navigation;
