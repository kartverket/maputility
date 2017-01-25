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
    this.x = e.x;
    this.y = e.y;
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
    var dx = this.x - tree.x;
    var dy = this.y - tree.y;

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
  * @param {number} x
  * @param {number} y
  * @return {boolean} True if intersects
  */
  intersects(radius, x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    var offset = Math.sqrt((dx * dx) + (dy * dy));
    var intersect = this.radius + radius;
    return offset <= intersect;
  }

  /**
  * Check if a line intersects the tree
  *
  * @this {GeometryTree}
  * @param {number} radius Radius / Threshold of the Check
  * @param {number} sx Start-X coordinate of line
  * @param {number} sy Start-Y coordinate of line
  * @param {number} ex End-X coordinate of line
  * @param {number} ey End-Y coordinate of line
  * @return {boolean} True if intersects
  */
  intersectsLine(radius, sx, sy, ex, ey) {
    var offset = this.element.distanceFromLine(sx, sy, ex, ey);
    console.log("OFFSET", offset, sx, sy, ex, ey);
    var intersect = this.radius + radius;
    return offset <= intersect;
  }

  /**
  * Locate child elements that intersects based on the input parameters
  *
  * @this {GeometryTree}
  * @param {number} radius Radius / Threshold of check
  * @param {number} x X Coordinate of check
  * @param {number} y Y Coordinate of check
  * @param {array} result Result array containing Geometry objects
  */
  findIntersect(radius, x, y, result) {
    var n = null, i = 0;
    for(; i < 4; i++) {
      n = this.children[i];
      if(n !== null && n.intersects(radius, x, y)){
        result.push(n.element);
        n.findIntersect(radius, x, y, result);
      }
    }
  }

  /**
  * Locate child elements that intersects based on the input line
  *
  * @this {GeometryTree}
  * @param {number} radius Radius / Threshold of check
  * @param {number} x Start-X coordinate of line
  * @param {number} y Start-Y coordinate of line
  * @param {number} ex End-X coordinate of line
  * @param {number} ey End-Y coordinate of line
  * @param {array} result Result array containing Geometry objects
  */
  findIntersectLine(radius, x, y, ex, ey, result) {
    var n = null, i = 0, offset = 0, intersect = 0;
    for(; i < 4; i++) {
      n = this.children[i];

      if(n === null) {
        continue;
      }

      offset = n.element.distanceFromLine(x, y, ex, ey);
      intersect = n.radius + radius;

      if(offset <= intersect) {
        if(offset < radius) {
          console.log(offset);
          result.push(n.element);
        }
        n.findIntersectLine(radius, x, y, ex, ey, result);
      }
    }
  }

}


export default GeometryTree;
