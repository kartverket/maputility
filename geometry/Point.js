import Geometry from "./Geometry";
"use strict";

/**
* Point, Geometry object representing a point
* @extends Geometry
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Point extends Geometry {

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}

export default Point;
