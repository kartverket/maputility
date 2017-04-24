import Vector2 from "../vector/Vector2";
"use strict";

const DEG_PER_RADIAN = 0.0174532925;
const DEG_LENGTH = 1.1025;

/**
* RouteRenderer, class to create mapbox annotations from generates routes
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class RouteRenderer {

  /**
  * Creates a instance of RouteRenderer
  *
  * @constructor
  * @this {RouteRenderer}
  * @param {GeoDB} db
  */
  constructor(db) {
    this.db = db;
    this.color = "#4a4a4a";
    this.alpha = 1;
    this.width = 2;
  }

  /**
  * Sets the color to use when generating a annotation
  *
  * @this {RouteRenderer}
  * @param {string} color Color to apply on the generated annotation
  */
  setColor(color) {
    this.color = color;
  }

  /**
  * Sets the alpha / opacity to use when generating a annotation
  *
  * @this {RouteRenderer}
  * @param {number} alpha Alpha / opacity to apply on the generated annotation
  */
  setAlpha(alpha) {
    this.alpha = alpha;
  }

  /**
  * Sets the strokeWidth to use when generating a annotation
  *
  * @this {RouteRenderer}
  * @param {number} width Width / thickness to apply on the generated annotation
  */
  setWidth(width) {
    this.width = width;
  }

  /**
  * Takes a generated route and returns a polyline mapbox annotation
  *
  * @this {RouteRenderer}
  * @param {String} id
  * @param {array} waypoints The generated route from navigation
  * @return {object} Mapbox polygline annotation
  */
  render(id, waypoints) {
    let len = waypoints.length, i = 0, result = [];
    for(; i < len; i++) {
      result.push(waypoints[i].toArray());
    }

    return {
      id: id,
      type: "polyline",
      coordinates: result,
      alpha: this.alpha,
      strokeAlpha: this.alpha,
      strokeColor: this.color,
      fillColor: this.color,
      color: this.color,
      strokeWidth: this.width
    };
  }

  /**
  *
  * @this {RouteRenderer}
  * @param {String} id
  * @param {array} waypoints [Vector2]
  * @return {object} Mapbox polygon annotation
  */
  renderPolygon(id, waypoints) {
    return {
      id: id,
      type: "polygon",
      coordinates: this.generatePolygon(waypoints),
      color: this.color,
      fillColor: this.color,
      // alpha: this.alpha / 4,
      alpha: 0,
      // fillAlpha: this.alpha / 4
      fillAlpha: 0
    };
  }

  /**
  * Generates a mapbox coordinate array
  *
  * @this {RouteRenderer}
  * @param {array} arr Array of Vector2 Coordinates
  * @param {array} clearances Width of polygon
  * @return {array}
  */
  generatePolygon(arr) {
    var len = arr.length, i = 1,
    resultLeft = [], resultRight = [],
    delta = new Vector2(0, 0), perp = new Vector2(0, 0), p2 = new Vector2(0, 0),
    p0 = null, p1 = arr[0], clearance = 0;

    resultRight.push(p1.toArray());

    for(; i < len; i++) {
      p0 = p1;
      p1 = arr[i];
      if(p0.equals(p1)) {
        continue;
      }
      clearance = Math.min(0.5, Math.max(p1.getClearance(), 0.005));
      p1.sub(p0, delta);
      delta.normalize();
      delta.perpendicular(perp);
      perp.x = perp.x * Math.cos(p0.x * DEG_PER_RADIAN);
      perp.mulScalar(clearance, perp);
      p0.add(perp, p2);
      resultLeft.push(p2.toArray());
      perp.mulScalar(-1, perp);
      p0.add(perp, p2);
      resultRight.push(p2.toArray());
    }

    resultRight.push(p1.toArray());
    var result = resultRight.concat(resultLeft.reverse());
    return result;
  }

}

export default RouteRenderer;
