import GeometryTree from "./GeometryTree";
import Geometry from "./Geometry";
import Polygon from "./Polygon";
import Circle from "./Circle";
import Point from "./Point";
import Line from "./Line";
import PolyLine from "./PolyLine";
"use strict";

/**
* GeometryCache, Cache for geometric structure, incorporates the GeometryTree structure for geometric search with a minimal processing footprint
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class GeometryCache {

  /**
  * Creates a instance of the GeometryCache
  *
  * @constructor
  * @this {GeometryCache}
  */
  constructor() {
    this.root = new Geometry();
    this.tree = new GeometryTree(this.root);
    this.elements = [];
    this.classCache = {
      "Polygon": Polygon,
      "Circle": Circle,
      "Point": Point,
      "Line": Line,
      "PolyLine": PolyLine
    };
  }

  /**
  * Adds a geometric object to the cache
  *
  * @this {GeometryCache}
  * @param {Geometry} g Instance of / inherits from the Geometry abstract class
  */
  add(g) {
    var t = new GeometryTree(g);
    this.elements.push(g);
    this.tree.add(t);
  }

  /**
  * Clears all data from the cache
  *
  * @this {GeometryCache}
  */
  clear() {
    this.tree = new GeometryTree(this.root);
    this.elements = [];
  }

  /**
  * Returns the backing list containing all the geometry objects in the cache
  *
  * @this {GeometryCache}
  * @return {array} List of Geometry objects maintained by this cache
  */
  list() {
    return this.elements;
  }

  /**
  * Rebuilds the backing optimsation structure of the cache
  *
  * @this {GeometryCache}
  */
  rebuild(){
    this.tree = new GeometryTree(this.root);
    for(var i = 0; i < this.elements.length; i++){
      this.tree.add(this.elements[i]);
    }
  }

  /**
  * Locates the closest point in the cache relative to the input coordinate
  *
  * @this {GeometryCache}
  * @param {number} x X coordinate
  * @param {number} y Y coordinate
  * @param {Geometry} The closest geometry object in the cache, null if none is found within 2 radius.
  */
  findClosest(x, y) {
    var result = [], i = 0, delta = Number.MAX_VALUE, curr = null, d = 0, dx = 0, dy = 0, shape;
    this.tree.findIntersect(5, x, y, result);

    for(; i < result.length; i++) {
      shape = result[i];
      dx = x - shape.x;
      dy = y - shape.y;
      d = Math.sqrt(( dx * dx ) + ( dy * dy ));
      if(d < delta) {
        delta = d;
        curr = shape;
      }
    }

    return curr;
  }

  /**
  * Locates all geometric objects in the specific radius
  *
  * @this {GeometryCache}
  * @param {number} radius Radius of search
  * @param {number} x X coordinate
  * @param {number} y Y coordinate
  * @return {array} List containing geometric objects
  */
  findInRadius(radius, x, y) {
    var result = [], arr = [], i = 0;
    this.tree.findIntersect(radius, x, y, result);

    for(; i < result.length; i++) {
      var shape = result[i];

      if(shape.isPointInside(x, y)){
        arr.push(shape);
      }
    }

    return arr;
  }

  /**
  * Locates all points the the cache relative to the input line
  *
  * @this {GeometryCache}
  * @param {number} radius Maximum distance from line allowed (Threshold)
  * @param {number} x Start of line X coordinate
  * @param {number} y Start of line Y coordinate
  * @param {number} ex End of line X coordinate
  * @param {number} ey End of line Y coordinate
  * @return {array} List of Geometry objects
  */
  findInLine(radius, x, y, ex, ey) {
    var result = [];
    this.tree.findIntersectLine(radius, x, y, ex, ey, result);
    return result;
  }

  /**
  * Returns the element with the given id, this works by index in the backing array
  *
  * @this {GeometryCache}
  * @param {number} id ID / index
  * @return {Geometry}
  */
  getElementById(id) {
    return (id >= 0 && id < this.elements.length) ? this.elements[id] : null;
  }

  /**
  * Serializes the cache into a JSON-string
  *
  * @this {GeometryCache}
  * @return {string} JSON formatted string
  */
  serialize(){

    var arr = [], i = 0, data = "", cls = "", element = null;

    for(; i < this.elements.length; i++) {
      element = this.elements[i];
      data = element.serialize();
      cls = element.constructor.name;
      arr.push({type: cls, data: data});
    }

    return JSON.stringify(arr);
  }

  /**
  * Constructs the cache from a previously serialized string in JSON format
  *
  * @this {GeometryCache}
  * @param {string} JSON formatted string
  */
  deserialize(str){
    this.clear();
    var arr = JSON.parse(str), i = 0, obj = null, s = null, type = "";

    for(; i < arr.length; i++) {
      obj = arr[i];
      type = obj.type;

      if(this.classCache.hasOwnProperty(type)){
        s = new this.classCache[type]();
        s.deserialize(obj.data);
        this.add(s);
      }else{
        console.log("Found class not defined in classCache: " + type);
      }
    }
  }

}


export {
  GeometryCache as default,
  Geometry,
  Polygon,
  Circle,
  Point,
  Line,
  PolyLine
};
