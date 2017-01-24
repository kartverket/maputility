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
  constructor(db) {
    this.db = db;
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
  generateAnnotation(start, route, end) {
    return {
      id: "route",
      type: "polyline",
      coordinates: this.interpolate(this.completeRoute(start, route, end), route),
      alpha: this.alpha,
      strokeColor: this.color,
      strokeWidth: this.width
    };
  }


  completeRoute(start, route, end) {
    var result = [start];
    var len = route.length;

    if(route.length > 2) {
      result.push(
        this.findOptimalIntersection(
          start,
          this.db.getCoordinateFromId(route[0]),
          this.db.getCoordinateFromId(route[1])
        )
      );
    }

    for(var i = 2; i < len - 2; i++) {
      result.push(this.db.getCoordinateFromId(route[i]));
    }

    if(route.length > 2) {
      result.push(
        this.findOptimalIntersection(
          end,
          this.db.getCoordinateFromId(route[len - 2]),
          this.db.getCoordinateFromId(route[len - 1])
        )
      );
    }

    result.push(end);
    return result;
  }

  /**
  * Interpolates the route
  *
  * @this {RouteRenderer}
  * @param {Vector2} start
  * @param {array} route
  * @param {Vector2} end
  */
  interpolate(route, indexes) {

    var len = route.length - 2;
    var result = [route[0].toArray()];
    var dba = new Vector2(0, 0);
    var dbc = new Vector2(0, 0);
    var a = null, b = null, c = null, n = null;
    var l0 = 0, l1 = this.db.getEdgeClearance(indexes[0], indexes[1]);
    var theta = 0;

    for(var i = 1; i < len; i++) {
      a = route[i];
      b = route[i + 1];
      c = route[i + 2];

      l0 = l1;
      l1 = i > 0 ? this.db.getEdgeClearance(indexes[i + 1], indexes[i + 2]) : 0;

      a.sub(b, dba);
      c.sub(b, dbc);
      dba.normalize();
      dbc.normalize();

      n = new Vector2(0, 0);
      dba.add(dbc, n);
      n.normalize();

      theta = (1 + dba.dot(dbc)) / 2;
      n.mulScalar(Math.min(l0, l1) * theta, n);
      n.add(b, n);

      result.push(n.toArray());
    }

    result.push(route[route.length - 1].toArray());
    return result;
  }

  /**
  *
  */
  findOptimalIntersection(p, a, b) {
    var ab = new Vector2(0,0);
    var ap = new Vector2(0,0);
    b.sub(a, ab);
    p.sub(a, ap);

    var ab2 = ab.x*ab.x + ab.y*ab.y;
    var apab = ap.x*ab.x + ap.y*ab.y;
    var t = apab / ab2;
    console.log("T",t);
    if(t < 0) {
      console.log("A");
      //return b;
    }else if(t > 1) {
      console.log("B");
      //  return a;
    }

    console.log("ABT");
    ab.mulScalar(t, ab);
    ab.add(a, ab);
    return ab;
  }

  /*
  function getClosestPoint(A:*, B:*, P:*, segmentClamp:Boolean=true):Point {
  var AP:Point = new Point(P.x - A.x, P.y - A.y),
  AB:Point = new Point(B.x - A.x, B.y - A.y);
  var ab2:Number=AB.x*AB.x+AB.y*AB.y;
  var ap_ab:Number=AP.x*AB.x+AP.y*AB.y;
  var t:Number=ap_ab/ab2;
  if (segmentClamp) {
  if (t<0.0) {
  t=0.0;
} else if (t> 1.0) {
t=1.0;
}

}
return new Point(A.x + AB.x * t, A.y + AB.y * t);
}
*/

}

export default RouteRenderer;
