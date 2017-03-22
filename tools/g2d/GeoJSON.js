import Vector2 from "../../vector/Vector2";
import fs from "fs";
"use strict";


class GeoJSON {

  constructor(path) {
    this.path = path;
    this.coordinates = [];
    this.adjacents = [];
    this.lines = [];
    this.area = [];
    this.priority = [];
  }

  load() {
    var str = fs.readFileSync(this.path);
    var json = JSON.parse(str);
    var keys = Object.keys(json);

    for(var i = 0; i < keys.length; i++) {
      var collection = keys[i];
      console.log("Found feature collection: " + collection);
      this.parseFeatureCollection(json[collection].features);
    }
  }

  parseFeatureCollection(collection) {
    console.log("Parsing " + collection.length + " features in collection...");

    for(var i = 0; i < collection.length; i++) {
      this.parseFeature(collection[i]);
    }
  }

  parseFeature(feature) {
    var coords = feature.geometry.coordinates;
    switch(feature.geometry.type) {
      case "LineString":
      this.parseLineString(coords);
      break;
      case "MultiLineString":
      this.parseMultiLineString(coords);
      break;
      case "MultiPolygon":
      this.parseMultiPolygon(coords);
      break;
    }
  }

  parseLineString(coords) {
    var coord = null, vec = null, adj = [], index = 0, j = 0, exists = false, p = null;

    for(var i = 0; i < coords.length; i++) {
      coord = coords[i];
      vec = new Vector2(+coord[0].toFixed(8), +coord[1].toFixed(8));
      index = this.findIndex(vec);

      if(index === -1) {
        adj = [];
        index = this.coordinates.length;
        this.coordinates.push(vec);
        this.adjacents.push(adj);
      }else{
        adj = this.adjacents[index];
      }

      if(i > 0){
        coord = coords[i - 1];
        vec = new Vector2(+coord[0].toFixed(8), +coord[1].toFixed(8));
        let pIndex = this.findIndex(vec);
        if(adj.indexOf(pIndex) === -1) {
          adj.push(pIndex);
        }
        this.lines.push([
          this.coordinates[pIndex],
          this.coordinates[index],
          pIndex,
          index
        ]);
      }

      if(i < coords.length - 1) {
        coord = coords[i + 1];
        vec = new Vector2(+coord[0].toFixed(8), +coord[1].toFixed(8));
        let nIndex = this.findIndex(vec);
        nIndex = nIndex === -1 ? this.coordinates.length : nIndex;
        if(adj.indexOf(nIndex) === -1) {
          adj.push(nIndex);
        }
      }
    }
  }

  getPriority(type) {
    switch(type) {
      case 2: return 2;
      case 1: return 3;
    }
    return 1;
  }

  findIndex(vec) {
    var p = null, i = 0;

    for(; i < this.coordinates.length; i++) {
      p = this.coordinates[i];
      if(p.x === vec.x && p.y === vec.y) {
        //if(p.distance(vec) < 0.00001 || p.x === vec.x && p.y === vec.y) {
        return i;
      }
    }

    return -1;
  }

  parseMultiLineString(data) {
    for(var i = 0; i < data.length; i++) {
      this.parseLineString(data[i]);
    }
  }

  parsePolygonLine(p0, p1) {
    this.area.push([
      new Vector2(+p0[0].toFixed(8), +p0[1].toFixed(8)),
      new Vector2(+p1[0].toFixed(8), +p1[1].toFixed(8))
    ]);
  }

  parsePolygon(coordinates) {
    for(var i = 1; i < coordinates.length; i++) {
      this.parsePolygonLine(coordinates[i - 1], coordinates[i]);
    }
  }

  parseMultiPolygon(data) {
    var j = 0, i = 0, arr = [];
    for(; i < data.length; i++) {
      arr = data[i];
      for(j = 0; j < arr.length; j++) {
        this.parsePolygon(arr[j]);
      }
    }
  }

}


export default GeoJSON;
