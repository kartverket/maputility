import Geometry from "./Geometry";
"use strict";

/**
* Line, Geometry object representing a line
* @extends Geometry
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Line extends Geometry {

  constructor(sx, sy, ex, ey) {
    super();
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;

    if(sx) {
      this.calculate();
    }
  }

  calculate() {
    var dx = this.ex - this.sx;
    var dy = this.ey - this.sy;
    this.setX( this.sx + dx / 2);
    this.setY( this.sy + dy / 2);
    this.radius = Math.sqrt(( dx * dx ) + ( dy * dy )) / 2;
  }

}

export default Line;
