"use strict";

/**
* GeometryTree, Optimized tree structure for search and subdivision of geometric structures in 2-Dimensional space
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class GeometryTree {

  /**
  * Creates a instance of the GeometryTree class
  *
  * @constructor
  * @this {GeometryTree}
  * @param {Geometry} e Geometry object
  */
  constructor(e) {
    this.element = e;
    this.radius = e.radius;
    this.children = [null, null, null, null];
  }

  /**
  * Adds a tree into the tree as a child element
  *
  * @this {GeometryTree}
  * @param {GeometryTree} tree
  */
  add(tree) {
    var dx = this.element.position.x - tree.element.position.x;
    var dy = this.element.position.y - tree.element.position.y;

    var index = this.toIndex(dx, dy);
    var child = this.children[index];

    this.adjustRadius(tree.radius, dx, dy);

    if (child === null) {
      this.children[index] = tree;
    } else {
      child.add(tree);
    }
  }

  /**
  * Adjusts the radius based on child tree radius and offset from current origin
  *
  * @this {GeometryTree}
  * @param {number} radius Radius of child tree
  * @param {number} dx Offset-X from origin to child tree
  * @param {number} dy Offset-y from origin to child tree
  */
  adjustRadius(radius, dx, dy) {
    var offset = Math.sqrt((dx * dx) + (dy * dy));
    var offsetRadius = offset + radius;
    this.radius = Math.max(this.radius, offsetRadius);
  }

  /**
  * Returns a elements potential index in the child elements array
  *
  * @this {GeometryTree}
  * @param {number} X-Coordinate
  * @param {number} Y coordinate
  * @return {number}
  */
  toIndex(x, y) {
    var cx = this.normalize(x);
    var cy = this.normalize(y);
    return cx + (cy * 2);
  }

  /**
  * Clamp a number to 1 or 0
  *
  * @this {GeometryTree}
  */
  normalize(a) {
    return a >= 0 ? 1 : 0;
  }

  /**
  * Check if a element defined by input radius and coordinates intersects the tree
  *
  * @this {GeometryTree}
  * @param {number} radius
  * @param {Vector2} vec2
  * @return {boolean} True if intersects
  */
  intersects(radius, vec2) {
    var offset = this.element.position.distance(vec2);
    var intersect = this.radius + radius;
    return offset <= intersect;
  }

  /**
  * Check if a line intersects the tree
  *
  * @this {GeometryTree}
  * @param {number} radius Radius / Threshold of the Check
  * @param {Vector2} p0 Start of line
  * @param {Vector2} p1 End of line
  * @return {boolean} True if intersects
  */
  intersectsLine(radius, p0, p1) {
    var offset = this.element.position.distanceFromLine(p0, p1);
    var intersect = this.radius + radius;
    return offset <= intersect;
  }

  /**
  * Locate child elements that intersects based on the input parameters
  *
  * @this {GeometryTree}
  * @param {number} radius Radius / Threshold of check
  * @param {Vector2} vec2 Coordinate
  * @param {array} result Result array containing Geometry objects
  */
  findIntersect(radius, vec2, result) {
    var n = null, i = 0;
    for(; i < 4; i++) {
      n = this.children[i];
      if(n !== null && n.intersects(radius, vec2)){
        result.push(n.element);
        n.findIntersect(radius, vec2, result);
      }
    }
  }

  /**
  * Locate child elements that intersects based on the input line
  *
  * @this {GeometryTree}
  * @param {number} radius Radius / Threshold of check
  * @param {Vector2} p0 Start of line coordinate
  * @param {Vector2} p1 End of line Coordinate
  * @param {array} result Result array containing Geometry objects
  */
  findIntersectLine(radius, p0, p1, result) {
    var n = null, i = 0, offset = 0, intersect = 0;
    for(; i < 4; i++) {
      n = this.children[i];

      if(n === null) {
        continue;
      }

      offset = n.element.position.distanceFromLine(p0, p1);
      intersect = n.radius + radius;

      if(offset <= intersect) {
        if(offset < radius) {
          result.push(n.element);
        }
        n.findIntersectLine(radius, p0, p1, result);
      }
    }
  }

}


export default GeometryTree;
