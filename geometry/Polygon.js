import Geometry from "./Geometry";
"use strict";

/**
* Polygon, Geometry object representing a polygon
* @extends Geometry
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Polygon extends Geometry {

  constructor(points) {
    super();

    if(points) {
      this.points = points;
      this.calculateCentroid();
      this.calculateRadius();
    }
  }

  calculateCentroid() {

    var arr = this.points;
    var i = 0, cx = 0, cy = 0, x0 = 0, y0 = 0, x1 = 0, y1 = 0, a = 0, signedArea = 0;

    for(; i < arr.length - 1; i++) {
      x0 = arr[i][0];
      y0 = arr[i][1];
      x1 = arr[i + 1][0];
      y1 = arr[i + 1][1];

      a = (x0 * y1) - (x1 * y0);
      signedArea += a;

      cx += (x0 + x1) * a;
      cy += (y0 + y1) * a;
    }

    x0 = arr[i][0];
    y0 = arr[i][1];
    x1 = arr[0][0];
    y1 = arr[0][1];

    a = (x0 * y1) - (x1 * y0);
    signedArea += a;

    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;

    this.x = cx / (3 * signedArea);
    this.y = cy / (3 * signedArea);
  }

  calculateRadius() {

    var arr = this.points;
    var i = 0, x = 0, y = 0, dx = 0, dy = 0, len = 0;

    for(; i < arr.length; i++) {
      x = arr[i][0];
      y = arr[i][1];

      dx = this.x - x;
      dy = this.y - y;

      len = Math.sqrt((dx * dx) + (dy * dy));
      this.radius = Math.max(this.radius, len);
    }
  }

  isPointInside(x, y) {

    var inside = false, i = 0, j = 0, arr = this.points;

    for(j = arr.length - 1; i < arr.length; j = i++) {
      var xi = arr[i][0], yi = arr[i][1];
      var xj = arr[j][0], yj = arr[j][1];

      if (
        ((yi > y) != (yj > y)) &&
        (x < ((xj - xi) * (y - yi) / (yj - yi) + xi))
      ){
        inside = !inside;
      }
    }

    return inside;
  }

}


export default Polygon;
