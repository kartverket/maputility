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
    this.update();
  }

  /**
  * Updates the waypoint data
  *
  * @this {RouteSegment}
  */
  update() {
    this.waypoints =
      this.completeRoute(
        this.start,
        this.path,
        this.end
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

    if(this.waypoints.length < 2) {
      return this.waypoints;
    }

    return this.cardinalSplineInterpolation(this.waypoints);
    //return this.cardinalSplineInterpolation(this.abstractSegment());
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
  * Render the raw route
  */
  debug(id) {
    return this.debugRenderer.render(id, this.waypoints);
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

    if(t <= 0) {
      return b;
    }else if(t > 1 || isNaN(t)) {
      return a;
    }

    ab.mulScalar(t, ab);
    ab.add(a, ab);
    return ab;
  }

  /**
  * Abstract the route segment into fewer coordinates
  *
  * @this {RouteSegment}
  * @return {array} Array of Vector2 coordinates for use in bezier calculation [point, control, point, control, point ...]
  */
  abstractSegment() {
    var i = 1, len = this.waypoints.length, result = [];
    var pDelta = new Vector2(0, 0), cDelta = new Vector2(0, 0), p0 = null, p1 = this.waypoints[0];
    var cTheta = 0, pTheta = 0, cThetaSign = 0, pThetaSign = 0;
    var buffer = [this.waypoints[0]];

    this.waypoints[1].sub(this.waypoints[0], pDelta);
    pDelta.normalize();

    for(; i < len; i++) {
      p0 = p1;
      p1 = this.waypoints[i];

      p1.sub(p0, cDelta);
      cDelta.normalize();

      pTheta = cTheta;
      cTheta = cDelta.dot(pDelta);

      pThetaSign = cThetaSign;
      cThetaSign = Math.sign(pTheta - cTheta);

      if(pThetaSign !== cThetaSign && buffer.length > 2) {
        buffer = this.calculateControlPoints(buffer, result);
      } else {
        buffer.push(p1);
      }
    }

    if(buffer.length > 2) {
      this.calculateControlPoints(buffer, result);
    } else if(buffer.length !== 0) {
      result = result.concat(buffer);
    }

    return result;
  }

  /**
  * Calculate the points where to place the bezier points
  *
  * @this {RouteSegment}
  * @param {array} buffer
  * @param {array} result
  */
  calculateControlPoints(buffer, result) {
    let cx = 0, cy = 0, j = 1, len = buffer.length - 1;
    let a = buffer[0], b = null, c = buffer[len];
    let mDist = 0, cDist = 0;

    for(; j < len; j++) {
      cDist = buffer[j].distanceFromLine(a, c);
      if(cDist > mDist) {
        mDist = cDist;
        b = buffer[j];
      }
    }

    result.push(a);
    result.push(b);
    return [c];
  }

  /**
  * Perform cardinaal spline interpolation of the abstracted route
  *
  * @this {RouteSegment}
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
    var result = [arr[0]];

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

        result.push(
          new Vector2(
            (c1 * arr[i].x) + (c2 * arr[i+1].x) + (c3 * t1.x) + (c4 * t2.x),
            (c1 * arr[i].y) + (c2 * arr[i+1].y) + (c3 * t1.y) + (c4 * t2.y)
          )
        );
      }
    }

    result.push(arr[arr.length - 1]);
    return result;
  }


  clone() {
    return new RouteSegment(this.db, this.start, this.path, this.end);
  }

}


export default RouteSegment;
