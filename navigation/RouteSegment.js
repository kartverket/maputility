import RouteRenderer from "./RouteRenderer";
import Vector2 from "../vector/Vector2";


/**
* Class representing a route segment
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class RouteSegment {

  /**
  *
  * @constructor
  * @this {RouteSegment}
  * @param {GeoDB} db
  * @param {Vector2} start
  * @param {array} path
  * @param {Vector2} end
  */
  constructor(db, start, path, end) {
    this.db = db;
    this.start = start;
    this.path = path;
    this.waypoints = [];
    this.end = end;
    this.pointer = 0;
    this.renderer = new RouteRenderer();
    this.update();
  }

  /**
  * Updates the waypoint data
  *
  * @this {RouteSegment}
  */
  update() {
    this.waypoints = this.interpolate(
      this.completeRoute(
        this.start,
        this.path,
        this.end
      ),
      this.path
    );
  }

  /**
  * Calculate the total distance of the route
  *
  * @this {RouteSegment}
  * @return {number} Distance in meters
  */
  distance() {
    var i = 1, len = this.length();
    var result = 0;

    for(; i < len; i++) {
      result += this.waypoints[i-1].geographicDistance(this.waypoints[i]);
    }

    return result;
  }

  /**
  * Amount of waypoint nodes in route
  *
  * @this {RouteSegment}
  * @return {number}
  */
  length() {
    return this.waypoints.length;
  }

  /**
  * Increment pointer and return the next point in route
  *
  * @this {RouteSegment}
  * @return {Vector2}
  */
  next() {
    this.pointer = this.pointer < this.length() ? this.pointer + 1 : this.pointer;
    return this.waypoints[this.pointer];
  }

  /**
  * Decrement pointer and return the previous point in the route
  *
  * @this {RouteSegment}
  * @return {Vector2}
  */
  prev() {
    this.pointer = this.pointer >= 0 ? this.pointer - 1 : this.pointer;
    return this.waypoints[this.pointer];
  }

  /**
  * Get a mapbox annotation representing this route segment
  *
  * @this {RouteSegment}
  * @param {number} id
  * @return {object}
  */
  render(id) {
    return this.renderer.render(id, this.waypoints);
  }

  /**
  * Get a mapbox annotation representing a portion of this route segment
  *
  * @this {RouteSegment}
  * @param {number} start
  * @param {number} end (optional)
  */
  subrender(start, end) {
    return this.renderer.render(this.subroute(start, end));
  }

  /**
  * Get the subroute between the given start and end index
  *
  * @this {RouteSegment}
  * @param {number} start
  * @param {number} end (optional)
  * @return {array} Route between the given start and end waypoint index
  */
  subroute(start, end) {
    var arr = [], i = start;
    if(typeof end === "undefined") {
      end = this.length();
    }

    for(; i < end; i++) {
      arr.push(this.waypoints[i]);
    }

    return arr;
  }

  /**
  * Complete the route
  *
  * @this {RouteSegment}
  * @return {array}
  */
  completeRoute() {
    var result = [this.start];
    var len = this.path.length;

    if(this.path.length > 2) {
      result.push(
        this.findOptimalIntersection(
          this.start,
          this.db.getCoordinateFromId(this.path[0]),
          this.db.getCoordinateFromId(this.path[1])
        )
      );
    }

    for(var i = 2; i < len - 2; i++) {
      result.push(this.db.getCoordinateFromId(this.path[i]));
    }

    if(this.path.length > 2) {
      result.push(
        this.findOptimalIntersection(
          this.end,
          this.db.getCoordinateFromId(this.path[len - 2]),
          this.db.getCoordinateFromId(this.path[len - 1])
        )
      );
    }

    result.push(this.end);
    return result;
  }

  /**
  * Interpolates the route
  *
  * @this {Route}
  * @param {Vector2} start
  * @param {array} route
  * @param {Vector2} end
  */
  interpolate(route) {
    var len = route.length - 2;
    var result = [route[0]];
    var dba = new Vector2(0, 0);
    var dbc = new Vector2(0, 0);
    var a = null, b = null, c = null, n = null;
    var l0 = 0, l1 = this.db.getEdgeClearance(this.path[0], this.path[1]);
    var theta = 0;

    for(var i = 1; i < len; i++) {
      a = route[i];
      b = route[i + 1];
      c = route[i + 2];

      l0 = l1;
      l1 = i > 0 ? this.db.getEdgeClearance(this.path[i + 1], this.path[i + 2]) : 0;

      a.sub(b, dba);
      c.sub(b, dbc);
      dba.normalize();
      dbc.normalize();

      n = new Vector2(0, 0);
      dba.add(dbc, n);
      n.normalize();

      theta = (1 + dba.dot(dbc)) / 2;
      n.mulScalar(Math.min(l0, l1) * theta, n);
      n.add(b, n);

      result.push(n);
    }

    result.push(route[route.length - 1]);
    return result;
  }

  /**
  * Locate the closest point in the line ab to the point p
  *
  * @this {RouteSegment}
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

    if(t < 0) {
      return b;
    }else if(t > 1) {
      return a;
    }

    ab.mulScalar(t, ab);
    ab.add(a, ab);
    return ab;
  }

}


export default RouteSegment;
