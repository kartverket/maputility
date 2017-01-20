/*
* Output navmesh data spec
* Format: JSON
* Content:
* - index: array with coordinates
*   - [i: [x, y], ...]
* - adjacent: array mapped to index, showing adjacent nodes
*   - [i: [j0, j1, ..., jn]]
* - heuristic
*   - {}
* - routeData: array showing area between adjacent nodes
*   - [k: [a0, a1, ..., an]]
* - routeIndex: like the adjacent array, but instead maps from index to areaIndex, with negative sign index, reverse the array A => B = - (B => A)
*   - [a: [k0, k1, ..., kn]]
*/

/*
* Bakes the geojson dataset we found into a useable graph / navmesh we can use in the app
* NOTE: Here be dragons, this code was written very quickly to do a very specific task, and does not follow a decent coding standard, do not venture further without prepartion!
* - Leif Andreas Rudlang
*/

var fs = require("fs");
var path = require("path");

if(process.argv.length < 4) {
  console.log("Please supply the required files, npm run g2d path_file area_file");
  process.exit(0);
}

var fpath = path.join( __dirname, "..", process.argv[2]);
var apath = path.join( __dirname, ".." ,process.argv[3]);

if(!fs.existsSync(fpath)) {
  console.log("Input path file does not exist", fpath);
  process.exit(1);
}else if(!fs.existsSync(apath)) {
  console.log("Input area file does not exist", apath);
  process.exit(1);
}

console.log("Attempting to read geojson file at", fpath);
var data = fs.readFileSync(fpath);
var json = JSON.parse(data);
var keys = Object.keys(json);


var indexData = [];
var routeData = [];
var featureData = [];
var lineData = [];
var areaData = [];
var areaIndex = [];
var areaChecked = {};
var area = [];

var verified = {};
var verifiedCount = 0;

for(var i = 0; i < keys.length; i++) {
  var collection = keys[i];
  console.log("Found feature collection: " + collection);
  parseFeatures(json[collection].features);
}

console.log("Merging adjacent nodes...");
mergeAdjacentLines();
mergeAdjacentPoints();
verify();

lineData = null;
verified = null;
featureData = null;

console.log("Routes: " + routeData.length);
console.log("Finished constructing primary graph, loading area...");
data = fs.readFileSync(apath);
json = JSON.parse(data);
keys = Object.keys(json);
for(var i = 0; i < keys.length; i++) {
  var collection = keys[i];
  console.log("Found feature collection: " + collection);
  parseFeatures(json[collection].features);
}

mergeArea();

var output = JSON.stringify({
  "index": indexData,
  "adjacent": routeData,
  "heuristic": [],
  "routeData": areaIndex,
  "routeIndex": area
});

/*
Heuristic format
1:
i: {j: val}
=>
[
1: {3: 3.4, 2: 2}
]
*/

console.log("Operation complete, writing output!");
fs.writeFile(path.join(__dirname,"../data","navmesh.json"), output);

function parseFeatures(arr) {
  console.log("Parsing " + arr.length + " features...");

  for(var i = 0; i < arr.length; i++) {
    parseFeature(arr[i]);
  }
}

function parseFeature(f) {
  var coords = f.geometry.coordinates;

  // Need to extract adjacents, and feature data


  // points
  // - index
  // - [i: [lat, lon]]
  // - adjacent
  // - [i: [ai1, ai2, ..., aiN]]

  // route
  // - index
  // - [i: j]
  // - data
  // - [j: {name, fwn, type, status, ..route_data}]
  switch(f.geometry.type) {
    case "LineString":
    parseLineString(coords);
    break;
    case "MultiLineString":
    parseMultiLineString(coords);
    break;
    case "MultiPolygon":
    parseMultiPolygon(coords);
    break;
  }
}

function parseLineString(coords) {

  for(var i = 0; i < coords.length; i++) {
    var coord = coords[i];
    coord[0] = +coord[0].toFixed(8);
    coord[1] = +coord[1].toFixed(8);
    var idx = indexData.length;
    indexData.push(coord);

    var adj = [];
    if(i > 0){
      adj.push(idx - 1);
    }
    if(i < coords.length - 1) {
      adj.push(idx + 1);
    }

    routeData.push(adj);

    if(i > 0) {
      lineData.push([coords[i-1], coords[i], idx-1, idx]);
    }
  }
}

function parseMultiLineString(data) {
  for(var i = 0; i < data.length; i++) {
    parseLineString(data[i]);
  }
}

function parsePolygonLine(p0, p1) {
  var sx = +p0[0].toFixed(8);
  var sy = +p0[1].toFixed(8);
  var ex = +p1[0].toFixed(8);
  var ey = +p1[1].toFixed(8);
  areaData.push([sx, sy, ex, ey]);
}

function parsePolygon(coordinates) {
  for(var i = 1; i < coordinates.length; i++) {
    parsePolygonLine(coordinates[i-1], coordinates[i]);
  }
}

function parseMultiPolygon(data) {
  var j = 0, i = 0, arr = [];
  for(; i < data.length; i++) {
    arr = data[i];
    for(j = 0; j < arr.length; j++) {
      parsePolygon(arr[j]);
    }
  }
}

function mergeAdjacentLines() { // check intersecting lines and add new node in intersectionpoint and adjacents

  console.log("Performing " + (lineData.length * (lineData.length - 1)) + " line-line intersection checks...");
  var length = lineData.length;

  for(var i = 0; i < length; i++) {
    var l0 = lineData[i];
    for(var j = 0; j < length; j++) {
      if(i !== j) {
        mergeLine(l0, lineData[j]);
      }
    }
  }
}

function mergeLine(l0, l1) {

  var intersect = checkLineIntersection(l0[0][0], l0[0][1], l0[1][0], l0[1][1],l1[0][0], l1[0][1], l1[1][0], l1[1][1]);
  if(intersect === null) {
    return;
  }

  var x = intersect[0], y = intersect[1];

  // check if point is already indexed
  var index = pointExists(x, y);

  if(index === -1) {
    // new point, manage
    var nIndex = indexData.length;
    var indexes = [l0[2], l0[3], l1[2], l1[3]];
    routeData.push(indexes);
    indexData.push([+x.toFixed(8), +y.toFixed(8)]);

    for(var i = 0; i < 4; i++) {
      routeData[indexes[i]].push(nIndex);
    }

  } else {

    // existing point, manage adjacents
    var adj = routeData[index];
    var indexes = [l0[2], l0[3], l1[2], l1[3]];
    for(var i = 0;  i < 4; i++) {
      if(adj.indexOf(indexes[i]) === -1) {
        adj.push(indexes[i]);
      }
    }
  }
}

function pointExists(x, y) {
  for(var i = 0; i < indexData.length; i++) {
    var coord = indexData[i];
    if(coord[0] === x && coord[1] === y){
      return i;
    }
  }
  return -1;
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
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
  return (a > 0 && a < 1) && (b > 0 && b < 1)
  ?
  [
    line1StartX + (a * (line1EndX - line1StartX)),
    line1StartY + (a * (line1EndY - line1StartY))
  ]
  :
  null;
}

function mergeAdjacentPoints() {
  console.log("Performing " + (lineData.length * (lineData.length - 1)) + " point-line intersection checks...");
  var lenL = lineData.length;
  var lenP = indexData.length;
  var i = 0, j = 0;

  for(; i < lenP; i++) {
    var p = indexData[i];
    for(j = 0; j < lenL; j++) {
      if(i !== j) {
        mergePoint(i, p, lineData[j]);
      }
    }
  }

  console.log("Performing " + (indexData.length * (indexData.length - 1)) + " point-point intersection checks...");
  for(i = 0; i < lenP; i++) {
    for(j = 0; j < lenP; j++) {
      if(i !== j) {
        mergeTwoPoints(i, j);
      }
    }
  }
}

function mergeTwoPoints(i, j) {
  var p0 = indexData[i], p1 = indexData[j];
  var dx = p0[0] - p1[0];
  var dy = p0[1] - p1[1];
  var len = Math.sqrt((dx * dx) + (dy * dy));
  if(len < 0.0005) {
    if(routeData[i].indexOf(j) === -1) {
      routeData[i].push(j);
    }

    if(routeData[j].indexOf(i) === -1) {
      routeData[j].push(i);
    }
  }
}

function mergePoint(idx, p, l) { // TODO debug adjacents
  var intersect = checkPointIntersection(p[0], p[1], l[0][0], l[0][1], l[1][0], l[1][1]);
  if(intersect === null) {
    return;
  }

  var x = +intersect[0].toFixed(8), y = +intersect[1].toFixed(8), d = intersect[2];
  // check if point is already indexed
  var index = d === 0 ? idx : pointExists(x, y);

  if(index === -1) {

    // new point, manage
    var nIndex = indexData.length;
    var indexes = [idx, l[2], l[3]];
    routeData.push(indexes);
    indexData.push([x, y]);

    for(var i = 0; i < 3; i++) {
      routeData[indexes[i]].push(nIndex);
    }
  }
}

function checkPointIntersection(x, y, sx, sy, ex, ey) {
  var dx = ex - sx;
  var dy = ey - sy;
  var a = ( dy * x ) - ( dx * y ) + ( ex * sy ) - ( ey * sx );
  var b = Math.sqrt(( dx * dx ) + ( dy * dy ));

  if(b === 0) {
    return verifyPointLineDistance(x, y, [sx, sy, 0]);
  }

  var d = Math.abs(a) / b;
  var t = (( x - sx ) * ( dx ) + ( y - sy ) * ( dy )) / b;

  if(t < 0) {
    return verifyPointLineDistance(x, y, [sx, sy]);
  }else if(t > 1) {
    return verifyPointLineDistance(x, y, [ex, ey]);
  }

  return verifyPointLineDistance(x, y, [ ex + t * dx , ey + t * dy]);
}

function verifyPointLineDistance(x, y, arr) {
  var dx = x - arr[0];
  var dy = y - arr[1];
  var len = Math.sqrt((dx * dx) + (dy * dy));
  arr.push(len);
  return len < 0.01 ? arr : null;
}

function mergeArea() {
  console.log("Merging " + indexData.length + " points with " + areaData.length + " area line segments, this may take a while.");
  var j = 0, i = 0, adj = [], arr = [], idx = 0;

  for(; i < routeData.length; i++) {
    arr = [];
    for(j = 0; j < routeData[i].length; j++) {
      arr.push(mergeAreaBetween(i, routeData[i][j]));
    }
    area.push(arr);
  }
}

function mergeAreaBetween(idA, idB) {

  if(areaChecked.hasOwnProperty(idA) && areaChecked[idA].hasOwnProperty(idB)) {
    return areaChecked[idA][idB];
  }else if(areaChecked.hasOwnProperty(idB) && areaChecked[idB].hasOwnProperty(idA)) {
    return areaChecked[idB][idA];
  }

  var p0 = indexData[idA];
  var p1 = indexData[idB];
  var x = p0[0], y = p0[1];
  var dx = p1[0] - x, dy = p1[1] - y;
  var len = Math.sqrt(( dx * dx ) + ( dy * dy ));
  var checks = Math.floor(2 + (len / 10));
  var mul = len / checks;
  var dxn = dx / len;
  var dyn = dy / len;
  var arr = [];

  if(len <= 0.01) {
    arr.push(minimumClearance(x, y));
  }else{
    for(var i = 0; i <= checks; i++) {
      var px = x + dxn * (mul * i);
      var py = y + dyn * (mul * i);
      arr.push(minimumClearance(px, py));
    }
  }

  if(areaChecked.hasOwnProperty(idA)) {
    areaChecked[idA][idB] = areaIndex.length;
  }else{
    var data = {};
    data[idB] = areaIndex.length;
    areaChecked[idA] = data;
  }

  if(areaChecked.hasOwnProperty(idB)) {
    areaChecked[idB][idA] = -areaIndex.length;
  }else{
    var data = {};
    data[idA] = -areaIndex.length;
    areaChecked[idB] = data;
  }

  areaIndex.push(arr);
  return areaChecked[idA][idB];
}

function minimumClearance(x, y) {
  var min = Number.MAX_VALUE, dist = 0, line = null;

  for(var i = 0; i < areaData.length; i++) {
    line = areaData[i];
    dist = pointLineDistance(x, y, line[0], line[1], line[2], line[3]);
    min = dist < min ? dist : min;
    if(min <= 0.000001) {
      return 0.000001;
    }
  }

  return +min.toFixed(8);
}

function pointLineDistance(x, y, sx, sy, ex, ey) {
  var dx = ex - sx;
  var dy = ey - sy;
  var a = ( dy * x ) - ( dx * y ) + ( ex * sy ) - ( ey * sx );
  var b = Math.sqrt(( dx * dx ) + ( dy * dy ));

  if(b == 0) {
    return 0;
  }

  return Math.abs(a) / b;
}

function verify() {
  console.log("Verifying mesh integrity...");
  var buffer = [0], adj = [], i = 0, j = 0, adjIdx = 0;
  verifiedCount = 1;

  while(buffer.length !== 0) {
    i = buffer.shift();
    adj = routeData[i];
    for(j = 0; j < adj.length; j++) {
      adjIdx = adj[j];
      if(!verified.hasOwnProperty(adjIdx)) {
        verified[adjIdx] = true;
        buffer.push(adjIdx);
        verifiedCount++;
      }
    }
  }

  console.log("Verified " + verifiedCount + " / " + indexData.length);
}
