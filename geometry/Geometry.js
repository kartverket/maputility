"use strict";

/**
* Geometry, Abstract class, implement this for structures to be searchable in the geometry system
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Geometry {

  /**
  * Creates a instance of the geometry class
  *
  * @constructor
  * @this {Geometry}
  */
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.zIndex = 0;
    this.visibility = true;
    this.data = null;
  }

  /**
  * Get the X-Coordinate of the object
  *
  * @this {Geometry}
  * @return {number}
  */
  getX() {
    return this.x;
  }

  /**
  * Get the Y-Coordinate of the object
  *
  * @this {Geometry}
  * @return {number}
  */
  getY() {
    return this.y;
  }

  /**
  * Get the Data of the object
  *
  * @this {Geometry}
  * @return {object}
  */
  getData(){
    return this.data;
  }

  /**
  * Set the data of the object
  *
  * @this {Geometry}
  * @param {object} data
  */
  setData(data){
    this.data = data;
  }

  /**
  * Serialize the object into a JSON formatted string
  *
  * @this {Geometry}
  * @return {string} JSON formatted string
  */
  serialize(){
    return JSON.stringify(this);
  }

  /**
  * Construct the geometry object from a JSON formatted string
  *
  * @this {Geometry}
  * @param {string} data JSON formatted string
  */
  deserialize(data){
    var json = JSON.parse(data);
    var keys = Object.keys(json), i = 0, key = "";

    for(; i < keys.length; i++){
      key = keys[i];
      this[key] = json[key];
    }
  }

  /**
  * Calculate the distance from the center of the geometry object to a line
  *
  * @this {Geometry}
  * @param {number} sx Start-X coordinate of the line
  * @param {number} sy Start-Y coordinate of the line
  * @param {number} ex End-X coordinate of the line
  * @param {number} ey End-Y coordinate of the line
  * @return {number} Distance from line
  */
  distanceFromLine(sx, sy, ex, ey) {
    var dx = ex - sx;
    var dy = ey - sy;

    var a = ( dy * this.x ) - ( dx * this.y ) + ( ex * sy ) - ( ey * sx );
    var b = Math.sqrt(( dx * dx ) + ( dy * dy ));

    return Math.abs(a) / b;
  }

  /**
  * Checks if a point is inside the current geometric object
  *
  * @this {Geometry}
  * @param {number} x X-Coordinate of point
  * @param {number} y Y-Coordinate of point
  * @return {boolean} True if point is inside
  */
  isPointInside(x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    var offset = Math.sqrt(( dx * dx ) + ( dy * dy ));
    return offset <= this.radius;
  }

  /**
  * Check if the geometric object is visible
  *
  * @this {Geometry}
  * @return {boolean} Visibility
  */
  isVisible() {
    return this.visibility;
  }

  /**
  * Get a mapbox annotation
  *
  * @this {Geometry}
  * @param {string} id
  * @return {object}
  */
  render(id) {
    return {
      id: id,
      type: "point",
      coordinates: [this.x, this.y],
      alpha: 1,
      fillAlpha: 1,
      fillColor: "black",
      strokeColor: "black",
      strokeWidth: 1
    };
  }
}

export default Geometry;
