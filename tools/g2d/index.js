import GeoJSON from "./GeoJSON";
import Merge from "./Merge";
import Output from "./Output";
import Vector2 from "../../vector/Vector2";
import path from "path";

if(process.argv.length < 4) {
  console.log("Please supply the required files 1 path file, 1 area file");
  process.exit(0);
}

var fpath = path.join( __dirname, "..", "..", process.argv[2]);
var apath = path.join( __dirname, ".." , "..", process.argv[3]);
var opath = path.join(__dirname, "../../data", "navmesh.json");

var gPath = new GeoJSON(fpath);
var gArea = new GeoJSON(apath);
var merge = new Merge(gPath, gArea);

gPath.load();
gArea.load();

console.log("Calculating initial clearance data");
merge.calculateClearance();
//console.log("Performing initial line merge operation");
//merge.mergeLines(); // TODO
console.log("Performing point merge operation");
merge.mergePoints();
//console.log("Performing adjacent merge operation");
//merge.npointscheck(); // TODO
console.log("Verified " + merge.verify() + " nodes");


console.log("Operation complete, writing output");
var out = new Output(opath);
out.write(gPath.coordinates, gPath.adjacents, merge.clearance);
