"use strict";

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
}

export default Vector2;
