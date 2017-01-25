import Geometry from "./Geometry";
"use strict";

/**
* Circle, Geometry object representing a circle
* @extends Geometry
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Circle extends Geometry {

  constructor(radius, x, y) {
    super();
    this.setX(x);
    this.setY(y);
    this.radius = radius;
  }
}

export default Circle;
