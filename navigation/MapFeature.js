import Point from "../geometry/Point";


const ICONS = {
  "bunkering": "gas",
  "port": "port",
  "guestport": "guest"
};

class MapFeature extends Point {

  /**
  *
  */
  constructor(type, feature) {
    super(feature.c[0], feature.c[1]);
    this.name = feature.n;
    this.region = feature.r;
    this.type = type;
  }

  render(id) {
    return {
      id: id,
      coordinates: this.position.toArray(),
      type: "point",
      title: this.name,
      subtitle: this.type,
      annotationImage: {
        source: { uri: ICONS[this.type]},
        height: 25,
        width: 25
      }
    };
  }

  toString() {
    return this.name + ", " + this.region + " (" + this.getX() + ", " + this.getY() + ")";
  }
}

export default MapFeature;
