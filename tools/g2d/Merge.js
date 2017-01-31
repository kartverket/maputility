import Vector2 from "../../vector/Vector2";
"use strict";

var test = 0;

class Merge {

  constructor(path, area) {
    this.path = path;
    this.area = area;
    this.clearance = [];
  }

  calculateClearance() {
    var coords = this.path.coordinates;
    var lines = this.area.area;
    var len = coords.length, j = 0, alen = lines.length;
    var point = null, line = null;
    var min = 0, dist = 0;

    for(var i = 0; i < len; i++) {
      this.clearance.push(this.minimumClearance(coords[i]));
    }
  }

  minimumClearance(p) {
    //return 0; // TODO to debug faster
    var min = Number.MAX_VALUE, lines = this.area.area, line = null;
    var dist = 0, j = 0, alen = lines.length;

    for(var i = 0; i < alen; i++) {
      line = lines[i];
      dist = p.distanceFromLine(line[0], line[1]);
      min = dist < min ? dist : min;
    }

    return +min.toFixed(8);
  }

  addCoordinate(p) {
    this.path.coordinates.push(p);
    this.clearance.push(this.minimumClearance(p));
  }

  // Create new points at intersecting lines
  mergeLines() {
    console.log("Points", this.path.coordinates.length);
    var lines = this.path.lines, i = 0, j = 0;
    var len = lines.length, l0, l1;

    for(; i < len; i++) {
      l0 = lines[i]
      for(j = 0; j < len; j++) {
        if(i !== j) {
          this.mergeLine(l0, lines[j]);
        }
      }
    }
  }

  mergeLine(l0, l1) {
    var intersect = this.checkLineIntersection(l0[0].x, l0[0].y, l0[1].x, l0[1].y, l1[0].x, l1[0].y, l1[1].x, l1[1].y);
    if(intersect === null) {
      return;
    }

    var x = intersect.x, y = intersect.y;

    // check if point is already indexed
    var index = this.pointExists(x, y);

    if(index === -1) {
      // new point, manage
      var nIndex = this.path.coordinates.length;
      var indexes = [l0[2], l0[3], l1[2], l1[3]];

      this.path.adjacents.push(indexes);
      this.addCoordinate(new Vector2(+x.toFixed(8), +y.toFixed(8)));

      for(var i = 0; i < 4; i++) {
        this.path.adjacents[indexes[i]].push(nIndex);
      }

    } else {

      // existing point, manage adjacents
      var adj = this.path.adjacents[index];
      var indexes = [l0[2], l0[3], l1[2], l1[3]];
      for(var i = 0;  i < 4; i++) {
        if(adj.indexOf(indexes[i]) === -1) {
          adj.push(indexes[i]);
        }
      }
    }
  }

  checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    var denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
      return null;
    }
    var a = line1StartY - line2StartY;
    var b = line1StartX - line2StartX;
    var numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    var numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    return (a > 0 && a < 1) && (b > 0 && b < 1) ?
    new Vector2(
      line1StartX + (a * (line1EndX - line1StartX)),
      line1StartY + (a * (line1EndY - line1StartY))
    ) : null;
  }

  pointExists(x, y) {
    var index = this.path.coordinates;

    for(var i = 0; i < index.length; i++) {
      var coord = index[i];
      if(
        Math.abs(coord.x - x) < 0.0001 &&
        Math.abs(coord.y - y) < 0.0001
       ){
        return i;
      }
    }
    return -1;
  }


  mergePoints() {
    var index = this.path.coordinates;
    var lines = this.path.lines;
    var adjacents = this.path.adjacents;
    var i = 0, j = 0;
    var p = null;
    var len = index.length;
    console.log("Points", len);

    // Merge point with adjacent line
    for(; i < len; i++) {
      p = index[i];
      for(j = 0; j < lines.length; j++) {
        this.mergePointLine(i, p, lines[j]);
      }
    }

    len = index.length;
    console.log("Performing " + (len * (len - 1)) + " point-point intersection checks...");
    for(i = 0; i < len; i++) {
      for(j = 0; j < len; j++) {
        if(i !== j) {
          this.mergeTwoPoints(i, j);
        }
      }
    }
  }

  mergePointLine(idx, p, l) {

    var intersect = this.checkPointLineIntersection(p, l);
    if(intersect === null) {
      return
    }

    var x = +intersect[0].x.toFixed(8), y = +intersect[0].x.toFixed(8), d = intersect[1];
    var index = d === 0 ? idx : pointExists(x, y);

    if(index === -1) {
      var nIndex = this.path.coordinates.length;
      var indexes = [idx, l[2], l[3]];
      this.path.adjacents.push(indexes);
      this.addCoordinate(new Vector2(x, y));
    }
  }

  checkPointLineIntersection(p, l) {
    var l0 = l[0], l1 = l[1];
    var d = new Vector2(0, 0);
    l1.sub(l0, d);
    var a = (d.x * p.x) - (d.x * p.x) + (l1.x * l0.y) - (l1.y - l0.x);
    var b = d.length();

    if(b === 0) {
      return this.verifyPointLineDistance(p, l0);
    }

    var d = Math.abs(a) / b;
    var t = ((p.x - l0.x) * d.x + (p.y - l0.y) * d.y) / b;

    if(t < 0) {
      return this.verifyPointLineDistance(p, l0);
    } else if( t > 1) {
      return this.verifyPointLineDistance(p, l1);
    }

    return this.verifyPointLineDistance(p, new Vector2(l1.x + t * d.x, l1.y + t * d.y));
  }

  verifyPointLineDistance(a, b) {
    var len = a.distance(b);
    return len < 0.0001 ? [b, len] : null;
  }

  mergeTwoPoints(i, j) {
    var p0 = this.path.coordinates[i], p1 = this.path.coordinates[j];
    var d = new Vector2(0, 0);
    p1.sub(p0, d);
    var len = d.length();
    var adj = this.path.adjacents;
    var offset = this.clearance[i] + this.clearance[j];

    if(len <= 0.0005 || len <= offset) {
      if(adj[i].indexOf(j) === -1) {
        adj[i].push(j);
      }

      if(adj[j].indexOf(i) === -1) {
        adj[j].push(i);
      }
    }
  }

  verify() {
    var buffer = [0], adj = [], i = 0, j = 0, adjIdx = 0;
    var verifiedCount = 1;
    var adjacents = this.path.adjacents;
    var verified = {};

    while(buffer.length !== 0) {
      i = buffer.shift();
      adj = adjacents[i];
      for(j = 0; j < adj.length; j++) {
        adjIdx = adj[j];
        if(!verified.hasOwnProperty(adjIdx)) {
          verified[adjIdx] = true;
          buffer.push(adjIdx);
          verifiedCount++;
        }
      }
    }

    return verifiedCount;
  }

}


export default Merge;
