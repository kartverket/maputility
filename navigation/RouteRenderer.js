import Vector2 from "../vector/Vector2";
"use strict";

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
    this.color = "red";
    this.alpha = 0.2;
    this.width = 25;
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
  * @param {number} route The generated route from navigation
  */
  render(id, waypoints) {

    return {
      id: id,
      type: "polyline",
      coordinates: waypoints,
      alpha: this.alpha,
      strokeColor: this.color,
      strokeWidth: this.width
    };
  }
}

export default RouteRenderer;
