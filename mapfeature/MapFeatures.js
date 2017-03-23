import GeometryCache from "../geometry/GeometryCache";
import PointMapFeature from "./PointMapFeature";
import PolygonMapFeature from "./PolygonMapFeature";
import Vector2 from "../vector/Vector2";
"use strict";

/**
* MapFeatures class
* Handles feature elements on for rendering and search
*
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
    switch(f.g) {
      case 0: // Point
      this.cache.add(new PointMapFeature(type, f));
      break;
      case 1: // Circle
      break;
      case 2: // Polygon
      this.cache.add(new PolygonMapFeature(type, f));
      break;
      case 3: // Line
      break;
    }
  }

  /**
  * Find features adjacent to the route
  *
  * @this {MapFeatures}
  * @param {array}
  * @param {number}
  * @return {array}
  */
  findInRoutePerStretch(radius, waypoints) {
    var result = [], p0 = null, p1 = waypoints[0], i = 1;
    for(; i < waypoints.length; i++) {
      p0 = p1;
      p1 = waypoints[i];
      result.push(this.cache.findInLine(radius, p0, p1));
    }
    return result;
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
    var result = new Set(), searchResult = null, p0 = null, p1 = waypoints[0], i = 1, j = 0;
    for(; i < waypoints.length; i++) {
      p0 = p1;
      p1 = waypoints[i];
      searchResult = this.cache.findInLine(radius, p0, p1);
      for(j = 0; j < searchResult.length; j++) {
        result.add(searchResult[j]);
      }
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

    let c = query[0];
    if(c === '(' || c === '-' || c >= '0' && c <= '9') {
      // Coordinate search
      let x = 0, y = 0, len = query.length, i = 0, j = 0;
      let buffer = ["",""];

      for(; i < len; i++) {
        c = query[i];
        switch(c) {
          case '(':
          case ')':
          break;
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

  /**
  * Performs a text search in the cache
  *
  * @this {MapFeatures}
  * @param {string} query
  * @param {requestCallback} call(error, result)
  */
  searchText(query, call) {
    let arr = this.cache.elements, result = [], i = 0;
    let len = arr.length, e = null, val = 0, aQuery = query.split(' ');

    for(; i < len; i++) {
      e = arr[i];
      val = this.rankQuery(aQuery, e);
      if(val !== -1) {
        result.push({v: val, e: e});
      }
    }

    result = result.sort((a,b)=>{
      return b.v - a.v;
    })

    call(null, result);
  }

  /**
  * Ranks the query against a potential result
  *
  * @this {MapFeatures}
  * @param {array} aQuery Query string split into individual words
  * @param {MapFeature} e Potential result
  * @return {number} How well the result and the query matches
  */
  rankQuery(aQuery, e) {
    let len = aQuery.length, i = 0, query = "", result = 0;
    let region = e.region.toLowerCase();
    let name = e.name.toLowerCase();
    let kIdx = name.indexOf("havn") !== -1;

    for(; i < len; i++) {
      query = aQuery[i];
      let rIdx = region.indexOf(query) !== -1;
      let nIdx = name.indexOf(query) !== -1;

      if(!rIdx && !nIdx) {
        return -1;
      }

      let rOffset = region.length - query.length;
      let nOffset = name.length - query.length;
      let offset = Math.sqrt((rOffset * rOffset) + (nOffset * nOffset));
      offset = Math.max(offset, 0.001);
      result += (nIdx*2 + rIdx*2 + kIdx*5) / offset;
    }

    return result / len;
  }

  /**
  * Peforms a coordinate search in the cache
  *
  * @this {MapFeatures}
  * @param {Vector2} vec2
  * @param {requestCallback} call(error, result)
  */
  searchCoordinates(vec2, call) {
    let e = this.cache.findClosest(vec2);
    if(e === null) {
      call("Error performing coordinate search", null);
    } else {
      call(null, [{v: 1, e: e}]);
    }
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
