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
  * @param {array} path
  */
  constructor(path) {
    this.path = path;
    this.pointer = 0;
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
      result += this.path[i-1].geographicDistance(this.path[i]);
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
    return this.path.length;
  }

  /**
  * Return the backing array
  *
  * @this {RouteSegment}
  * @return {array}
  */
  list() {
    return this.path;
  }

  /**
  * Increment pointer and return the next point in route
  *
  * @this {RouteSegment}
  * @return {Vector2}
  */
  next() {
    this.pointer = this.pointer < this.length() ? this.pointer + 1 : this.pointer;
    return this.path[this.pointer];
  }

  /**
  * Decrement pointer and return the previous point in the route
  *
  * @this {RouteSegment}
  * @return {Vector2}
  */
  prev() {
    this.pointer = this.pointer >= 0 ? this.pointer - 1 : this.pointer;
    return this.path[this.pointer];
  }

  /**
  * Create a identical instance of this RouteSegment
  *
  * @this {RouteSegment}
  * @return {RouteSegment}
  */
  clone() {
    return new RouteSegment(this.path);
  }

}


export default RouteSegment;
