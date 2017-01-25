import GeometryCache, { Point } from "../geometry/GeometryCache";
import Vertice from "./Vertice";
import Vector2 from "../vector/Vector2";

/**
* GeoDB, Class to handle nav-mesh data
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class GeoDB {

  /**
  * Get data from point A to point B
  *
  * @constructor
  * @this {GeoDB}
  */
  constructor() {
    this.cache = new GeometryCache();
    this.edges = [];
    this.routeIndex = [];
    this.routeData = [];
  }

  /**
  * Load the mesh into the database
  *
  * @this {GeoDB}
  */
  load() {
    var data = require("../data/navmesh.json"); // TODO we are probably going to need a better way to load this in, so we can refresh it when a route changes globally

    if(!data.index || !data.adjacent) {
      console.log("Data does not contain index and adjacent field");
      return;
    }

    var indexData = data.index, len = data.index.length, e, v, i = 0;

    // Mapping vertice coordinates
    for(; i < len; i++) {
      e = indexData[i];
      v = new Vertice(e[1], e[0]);
      v.index = i;
      this.cache.add(v);
    }

    var adjData = data.adjacent;
    len = adjData.length;

    // Mapping adjacent vertices
    for(i = 0; i < len; i++) {
      e = adjData[i];
      this.getVerticeById(i).adj = e;
    }

    this.routeIndex = data.routeIndex;
    this.routeData = data.routeData;
  }

  /**
  * Reset the mesh nodes (Done internally before every search)
  *
  * @this {GeoDB}
  */
  reset() {
    var list = this.cache.list();
    var len = list.length;
    for(var i = 0; i < len; i++) {
      list[i].reset();
    }
  }

  /**
  * Get data from vertice A to vertice B
  *
  * @this {GeoDB}
  * @param {number} idA Vertice A ID / Index
  * @param {number} idB Vertice B ID / Index
  * @return {object} Object containing edge data
  */
  getEdgeData(idA, idB) {
    if(idA < 0 || idA >= this.edges.length) {
      return null;
    }

    var data = this.edges[idA];
    return data.hasOwnProperty(idB) ? data[idB] : null;
  }


  /**
  * Get area for clearance intergration from vertice A to vertice B
  *
  * @this {GeoDB}
  * @param {number} idA Vertice A ID / Index
  * @param {number} idB Vertice B ID / Index
  * @return {array} Array containing approximate clearance data, returns null if not found
  */
  getEdgeClearance(idA, idB) {

    var v = this.getVerticeById(idA);

    if(v == null) {
      return 0;
    }

    var index = v.adj.indexOf(idB);
    if(index === -1) {
      return 0;
    }

    var rIndex = this.routeIndex[idA][index];
    var aIndex = Math.abs(rIndex);
    return this.routeData[aIndex];
  }

  /**
  * Get a vertice specified by ID / Index
  *
  * @this {GeoDB}
  * @param {number} id Vertice ID / Index
  * @return {Vertice} Vertice object, null if not found
  */
  getVerticeById(id) {
    return this.cache.getElementById(id);
  }

  getCoordinateFromId(id) {
    var e = this.cache.getElementById(id);
    return new Vector2(e.x, e.y);
  }

  /**
  * Finds the closest vertice to the input coordinates
  *
  * @this {GeoDB}
  * @param {number} x X Coordinate
  * @param {number} x Y Coordinate
  * @return {Vertice} Closest vertice, null if not found
  */
  findClosestNode(x, y) {
    return this.cache.findClosest(x, y);
  }

}

export default GeoDB;
