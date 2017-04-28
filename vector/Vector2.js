"use strict";


const RADIUS_EARTH = 6371;
const DEG_PER_RADIAN = 0.0174532925;
const DEG_LENGTH = 1.1025;

/**
* Vector2
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Vector2 {

  /**
  * Creates a instance of the Vector2 Class
  *
  * @constructor
  * @this {Vector2}
  * @param {number} x
  * @param {number} y
  */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
  * Adds this vector and the input vector and sets the result to the destination vector
  * Destination = this + vec2
  *
  * @this {Vector2}
  * @param {Vector2} vec2 Input vector
  * @param {Vector2} destination Destination vector
  */
  add(vec2, destination) {
    destination.x = this.x + vec2.x;
    destination.y = this.y + vec2.y;
  }

  /**
  * Subtracts this vector and the input vector and sets the result to the destination vector
  * Destination = this - vec2
  *
  * @this {Vector2}
  * @param {Vector2} vec2 Input vector
  * @param {Vector2} destination Destination vector
  */
  sub(vec2, destination) {
    destination.x = this.x - vec2.x;
    destination.y = this.y - vec2.y;
  }

  /**
  * Multiply this vector and the input vector and sets the result to the destination vector
  * Destination = this * vec2
  *
  * @this {Vector2}
  * @param {Vector2} vec2 Input vector
  * @param {Vector2} destination Destination vector
  */
  mul(vec2, destination) {
    destination.x = this.x * vec2.x;
    destination.y = this.y * vec2.y;
  }

  /**
  * Multiply this vector and the input scalar and sets the result to the destination vector
  * Destination = this * n
  *
  * @this {Vector2}
  * @param {number} scalar Input vector
  * @param {Vector2} destination Destination vector
  */
  mulScalar(scalar, destination) {
    destination.x = this.x * scalar;
    destination.y = this.y * scalar;
  }

  /**
  * Divide this vector with the input vector and store the result in the destination vector
  *
  * @this {Vector2}
  * @param {Vector2} vec2
  * @param {Vector2} destination
  */
  div(vec2, destination) {
    destination.x = this.x / vec2.x;
    destination.y = this.y / vec2.y;
  }

  /**
  * Divide this vector with the input scalar and store the result in the destination vector
  *
  * @this {Vector2}
  * @param {number} scalar
  * @param {Vector2} destination
  */
  divScalar(scalar, destination) {
    destination.x = this.x / scalar;
    destination.y = this.y / scalar;
  }

  /**
  * Cross product of this vector and the input, in 2D space this operation returns the Z-Axis
  *
  * @this {Vector2}
  * @param {Vector2} vec2 Input vector
  * @return {number}
  */
  cross(vec2) {
    return (this.x * vec2.y) - (vec2.x * this.y);
  }

  /**
  * Dot product between this and the input vector
  *
  * @this {Vector2}
  * @param {Vector2} vec2 Input vector
  * @return {number}
  */
  dot(vec2) {
    return this.x * vec2.x + this.y * vec2.y;
  }

  /**
  * Gets this vectors perpendicular vector
  *
  * @this {Vector2}
  * @param {Vector2} destination Destination vector
  */
  perpendicular(destination) {
    destination.x = this.y;
    destination.y = -this.x;
  }

  /**
  * Normalize this vector
  *
  * @this {Vector2}
  */
  normalize() {
    var len = this.length();
    if(len !== 0) {
      this.x = this.x / len;
      this.y = this.y / len;
    }
  }

  /**
  * Sets the X and Y component of this vector
  *
  * @this {Vector2}
  * @param {number} x
  * @param {number} y
  */
  set(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
  * Returns the euclidian length of the vector
  *
  * @this {Vector2}
  * @return {number}
  */
  length() {
    return Math.sqrt(( this.x * this.x ) + ( this.y * this.y ));
  }

  /**
  * Pythagoric distance (on a plane)
  *
  * @this {Vector2}
  * @param {Vector2} vec2
  * @return {number}
  */
  distance(vec2) {
    var dx = this.x - vec2.x;
    var dy = this.y - vec2.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  /**
  * Returns the geographic distance between this and the input coordinate
  * X = lat, Y = lon
  * @this {Vector2}
  * @param {Vector2} vec2
  * @return {number} distance
  */
  geographicDistance(vec2) {
    var dLat = (vec2.x-this.x) * (Math.PI / 180);
    var dLon = (vec2.y-this.y) * (Math.PI / 180);
    var lat1 = this.x * (Math.PI / 180);
    var lat2 = vec2.x * (Math.PI / 180);
    var a = (
      (Math.sin(dLat/2) * Math.sin(dLat/2)) +
      (Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2))
    );
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return RADIUS_EARTH * c;
  }

  /**
  * Fast, but less accurate geographic distance
  *
  * @this {Vector2}
  * @param {Vector2} vec2
  * @return {number} distance
  */
  fgDistance(vec2) {
    var dx = (this.x - vec2.x);
    var dy = (this.y - vec2.y) * Math.cos(vec2.x * DEG_PER_RADIAN);
    return Math.sqrt((dx * dx) + (dy * dy)) * DEG_LENGTH;
  }

  /**
  * Calculates the distance from a finite line defined by the two input coordinates
  *
  * @this {Vector2}
  * @param {Vector2} p0 Start of line
  * @param {Vector2} p1 End of line
  * @return {number} minimum distance from this vector to the line
  */
  distanceFromLine(p0, p1) {
    var l2 = p0.distanceTo(p1);

    if(l2 === 0) {
      return this.distanceTo(p0);
    }

    var t = ((this.x - p0.getX()) * (p1.getX() - p0.getX()) + (this.y - p0.getY()) * (p1.getY() - p0.getY())) / l2;

    t = Math.max(0, Math.min(1, t));
    var px = p0.getX() + (p1.getX() - p0.getX()) * t;
    var py = p0.getY() + (p1.getY() - p0.getY()) * t;
    var dx = this.x - px;
    var dy = this.y - py;

    return Math.sqrt((dx * dx) + (dy * dy));
  }

  /**
  * Calculates the distance from a finite line defined by the two input coordinates
  * Fast Geographic version
  *
  * @this {Vector2}
  * @param {Vector2} p0 Start of line
  * @param {Vector2} p1 End of line
  * @return {number} minimum distance from this vector to the line
  */
  fgDistanceFromLine(p0, p1) {
    var l2 = p0.distanceTo(p1);

    if(l2 === 0) {
      return this.distanceTo(p0);
    }

    var t = ((this.x - p0.getX()) * (p1.getX() - p0.getX()) + (this.y - p0.getY()) * (p1.getY() - p0.getY())) / l2;
    t = Math.max(0, Math.min(1, t));
    var px = p0.getX() + (p1.getX() - p0.getX()) * t;
    var py = p0.getY() + (p1.getY() - p0.getY()) * t;
    var dx = this.x - px;
    var dy = (this.y - py) * Math.cos(px * DEG_PER_RADIAN);
    return Math.sqrt((dx * dx) + (dy * dy)) * DEG_LENGTH;
  }


  /**
  * Clone this vector onto a existing vector, or create a new one if none is supplied
  *
  * @this {Vector2}
  * @param {Vector2} destination Destination vector
  * @return {number}
  */
  clone(destination) {
    if(destination) {
      destination.x = this.x;
      destination.y = this.y;
    }else{
      return new Vector2(this.x, this.y);
    }
  }

  /**
  * Returns a array representing this vector
  *
  * @this {Vector2}
  * @return {array} [x, y]
  */
  toArray() {
    return [this.x, this.y];
  }

  /**
  * Get a string representation of this object
  *
  * @return {string}
  */
  toString() {
    return this.x.toFixed(2) + ", " + this.y.toFixed(2);
  }

  /**
  * Checks if input vector is identical to this vector
  *
  * @this {Vector2}
  * @param {Vector2} vec2
  * @return {boolean}
  */
  equals(vec2) {
    return this.x === vec2.x && this.y === vec2.y;
  }

  hash() {
    return (this.x.toFixed(2) + "x" + this.y.toFixed(2));
  }
}

export default Vector2;
