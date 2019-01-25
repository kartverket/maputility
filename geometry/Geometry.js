import Vector2 from "../vector/Vector2";

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
    this.position = new Vector2(0,0);
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
    return this.position.x;
  }

  /**
  * Set the X coordinate position
  *
  * @this {Geometry}
  * @param {number} x
  */
  setX(x) {
    this.position.x = x;
  }

  /**
  * Get the Y-Coordinate of the object
  *
  * @this {Geometry}
  * @return {number}
  */
  getY() {
    return this.position.y;
  }

  /**
  * Set the Y coordinate position
  *
  * @this {Geometry}
  * @param {number} y
  */
  setY(y) {
    this.position.y = y;
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
  * @param {Vector2} p0 Start coordinate of line
  * @param {Vector2} p1 End coordinate of line
  * @return {number} Distance from line
  */
  distanceFromLine(p0, p1) {
    return this.position.distanceFromLine(p0, p1)
  }

  /**
  * Checks if a point is inside the current geometric object
  *
  * @this {Geometry}
  * @param {number} x X-Coordinate of point
  * @param {number} y Y-Coordinate of point
  * @return {boolean} True if point is inside
  */
  isPointInside(vec2) {
    var offset = this.position.distance(vec2);
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
