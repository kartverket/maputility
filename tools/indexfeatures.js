/*
* Utility script to index geojson features into a format that takes less space and is easier to index
*/

var fs = require("fs");
var path = require("path");

if(process.argv.length < 3) {
  console.log("Please supply the required files");
  process.exit(0);
}

var fpath = path.join( __dirname, "..", process.argv[2]);

if(!fs.existsSync(fpath)) {
  console.log("Input path file does not exist", fpath);
  process.exit(1);
}

console.log("Attempting to read geojson file at", fpath);

var data = fs.readFileSync(fpath);
var json = JSON.parse(data);
var features = {};
var counter = 0;


for(var i = 0; i < json.length; i++) {
  var collection = json[i];
  console.log("Found feature collection: " +  collection.name);
  features[collection.name] = parseFeatures(collection.name, collection.features);
}

var output = JSON.stringify(features);

console.log("Parsed " + counter + " features")
console.log("Operation complete, writing output!");
fs.writeFile(path.join(__dirname,"../data","features.json"), output);

function parseFeatures(type, features) {
  var result = [];

  for(var i = 0; i < features.length; i++) {
    result.push(parseFeature(type, features[i]));
  }

  return result;
}

function parseFeature(type, f) {
  counter++;
  var data = {};
  var prop = f.properties;

  switch(type) {
    case "bunkering":
    data["fuel"] = prop.DRIVSTOFF;
    break;
    case "port":
    data["uuid"] = prop.uuid;
    break;
    case "guestport":

    break;
  }

  var region = prop.Kommune || prop.kommune;

  return {
    c: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
    d: data,
    n: prop.Name || prop.navn,
    r: region ? region.toLowerCase() : ""
  }
}
