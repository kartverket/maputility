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
  */
  constructor() {
    this.color = "red";
    this.alpha = 1;
    this.width = 5;
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
  generateAnnotation(route) {
    var coordinates = [], len = route.length, coordinate;

    for(var i = 0; i < len; i++) {
      coordinate = route[i];
      coordinates.push([coordinate.x, coordinate.y]);
    }

    return {
      id: "route",
      type: "polyline",
      coordinates: coordinates,
      alpha: this.alpha,
      strokeColor: this.color,
      strokeWidth: this.width
    };
  }

  /**
  * Optimize a rough route into one with finer detail
  *
  * @this {RouteRenderer}
  * @param {array} coords
  * @return {array}
  */
  optimizeRoute(coords) {


  }

}

export default RouteRenderer;
