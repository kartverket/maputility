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
    var coord = null, vec = null, adj = [], index = 0;

    for(var i = 0; i < coords.length; i++) {
      coord = coords[i];
      vec = new Vector2(+coord[0].toFixed(8), +coord[1].toFixed(8));
      index = this.coordinates.length;
      this.coordinates.push(vec);

      var adj = [];
      if(i > 0){
        adj.push(index - 1);
      }
      if(i < coords.length - 1) {
        adj.push(index + 1);
      }

      this.adjacents.push(adj);

      if(i > 0) {
        this.lines.push([
          this.coordinates[i - 1],
          this.coordinates[i],
          index - 1,
          index
        ]);
      }
    }
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
