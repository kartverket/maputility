import Vector2 from "../../vector/Vector2";
import fs from "fs";
"use strict";

class Output {

  constructor(path) {
    this.path = path;
  }

  write(coordinates, adjacents, clearance) {

    var cdata = [];

    for(var i = 0; i < coordinates.length; i++) {
      cdata.push(coordinates[i].toArray());
    }

    var data = JSON.stringify({
      "index": cdata,
      "adjacent": adjacents,
      "heuristic": [],
      "clerance": clearance
    });
    fs.writeFile(this.path, data);
  }

}


export default Output;
