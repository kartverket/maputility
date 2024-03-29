import NavmeshDatabase from "./NavmeshDatabase";
import AStarPathfinder from "./AStarPathfinder";
// import RouteRenderer from "./RouteRenderer";
// import Vector2 from "../vector/Vector2";
import Route from "./Route";
import RouteSegment from "./RouteSegment";
import PathCache from "../cache/PathCache";

/**
* RoutePlotter, Main RoutePlotter class
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
* @todo Test cases (Optimal route check)
* @todo finish heuristics function
* @todo Specify interface for pathfinding heuristics
* @todo Multithreaded processing (Interface for communicating between threads)
*/
class RoutePlotter {

  /**
  * Creates a instance of the RoutePlotter class
  *
  * @constructor
  * @this {RoutePlotter}
  */
  constructor() {
    this.cache = new PathCache();
    this.db = new NavmeshDatabase();
    this.db.load();
  }

  /**
  * Generates a route based on the previously set destination and origin coordinates
  *
  * @this {RoutePlotter}
  * @return {Route}
  */
  plot(waypoints, call) {
    if(waypoints.length < 2) {
      call("Need atleast 2 waypoints to plot a route", null);
    } else {
      var hash = this.pathHash(waypoints);
      if(this.cache.contains(hash)) {
        // Fetch route from cache
        var data = this.cache.get(hash);
        call(null, data);
      } else {
        // Route not found in cache, recalculate
        var len = waypoints.length, routeSegment = null, i = 1;
        var route = new Route(waypoints);
        for(; i < len; i++) {
          routeSegment = this.calculateRouteSegment(waypoints[i - 1], waypoints[i]);
          route.push(routeSegment);
        }
        route.update();
        this.cache.set(hash, route);
        call(null, route);
      }
    }
  }

  /**
  * Calculate a route between two coordinates
  *
  * @this {RoutePlotter}
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
      var route = new RouteSegment(path);
      return route;
    }
  }

  /**
  * Finds the closest point in the navmesh relative to the input coordinates
  *
  * @this {RoutePlotter}
  * @param {Vector2} vec2
  * @return {Vertice}
  */
  findClosestNode(vec2) {
    return this.db.findClosestNode(vec2);
  }

  pathHash(path) {
    var hash = "";
    for(var i = 0; i < path.length; i++) {
      hash += path[i].hash()+"#";
    }
    return hash;
  }
}

export default RoutePlotter;
