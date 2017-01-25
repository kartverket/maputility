import GeometryCache from "../geometry/GeometryCache";
import MapFeature from "./MapFeature";
"use strict";

/**
* MapFeatures class
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class MapFeatures {

  constructor() {
    this.cache = new GeometryCache();
  }

  load() {
    var data = require("../data/features.json");
    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++) {
      this.addCollection(keys[i], data[keys[i]]);
    }
  }

  addCollection(type, data) {
    for(var i = 0; i < data.length; i++) {
      this.addFeature(type, data[i]);
    }
  }

  addFeature(type, f) {
    var mf = new MapFeature(type, f);
    this.cache.add(mf);
    console.log("added feature", mf.name);
  }

  /**
  * Find features adjacent to the route
  *
  * @this {MapFeatures}
  * @param {array}
  * @param {number}
  * @return {array}
  */
  findInRoute(radius, waypoints) {
    var result = [], p0 = null, p1 = waypoints[0], i = 1;
    for(; i < waypoints.length; i++) {
      p0 = p1;
      p1 = waypoints[i];
      result.push(this.cache.findInLine(radius, p0.x, p0.y, p1.x, p1.y));
    }
    return result;
  }

  /**
  * Generate mapbox annotation array
  *
  * @this {MapFeatures}
  * @return {array} [annotations]
  */
  render() {
    var arr = this.cache.elements, result = [];
    for(var i = 0; i < arr.length; i++) {
      result.push(arr[i].render("feature_"+i));
    }
    return result;
  }

}

export default MapFeatures;
