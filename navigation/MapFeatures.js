import GeometryCache from "../geometry/GeometryCache";
import MapFeature from "./MapFeature";
import Vector2 from "../vector/Vector2";
"use strict";

/**
* MapFeatures class
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class MapFeatures {

  /**
  * Creates a instance of the MapFeatures class
  *
  * @constructor
  * @this {MapFeatures}
  */
  constructor() {
    this.cache = new GeometryCache();
  }

  /**
  * Loads data from data/features.json into the cache
  *
  * @this {MapFeatures}
  */
  load() {
    var data = require("../data/features.json");
    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++) {
      this.addCollection(keys[i], data[keys[i]]);
    }
  }

  /**
  * Adds a feature collection to the cache
  *
  * @this {MapFeatures}
  * @param {string} type Feature type
  * @param {array} data Array of feature data
  */
  addCollection(type, data) {
    for(var i = 0; i < data.length; i++) {
      this.addFeature(type, data[i]);
    }
  }

  /**
  * Adds a feature to the cache
  *
  * @this {MapFeatures}
  * @param {string} type Feature type
  * @param {object} f Feature data
  */
  addFeature(type, f) {
    var mf = new MapFeature(type, f);
    this.cache.add(mf);
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
      result.push(this.cache.findInLine(radius, p0, p1));
    }
    return result;
  }

  /**
  * Search map features, checks if input is coordinate or text, and passes it on for searching
  *
  * @this {MapFeatures}
  * @param {string} query
  * @param {requestCallback} call (error, [MapFeature])
  */
  search(query, call) {
    if(query.length === 0) {
      call("Empty query");
      return;
    }

    if(query[0] === '-' || query[0] >= '0' && query[0] <= '9') {
      // Coordinate search
      let x = 0, y = 0, len = query.length, i = 0, j = 0, c = '';
      let buffer = [""];

      for(; i < len; i++) {
        c = query[i];
        switch(c) {
          case ',':
          case ' ':
          j += buffer[j].length !== 0;
          break;
          default:
          buffer[j] += c;
        }
      }

      try {
        x = buffer.length >= 1 ? Number(buffer[0]) : x;
        y = buffer.length >= 2 ? Number(buffer[1]) : y;
        this.searchCoordinates(new Vector2(x, y), call);
      }catch(err){
        call(err);
      }
    } else {
      // Text search
      this.searchText(query, call);
    }
  }

  searchText(query, call) {
    console.log("searching text", query);
  }

  searchCoordinates(vec2, call) {
    console.log("searching coordinates", vec2);
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
