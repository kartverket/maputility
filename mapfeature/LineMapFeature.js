import Line from "../geometry/Line";
import Waypoint from "../vector/Waypoint";


class LineMapFeature extends Line {

  /**
  *
  */
  constructor(type, feature) {
    super(feature.c[0], feature.c[1], feature.c[2], feature.c[3]);
    this.name = feature.n;
    this.region = feature.r;
    this.type = type;
  }

  render(id, image) {
    return {
      id: id,
      coordinates: this.position.toArray(),
      type: "point",
      title: this.name,
      subtitle: this.type,
      annotationImage: image
    };
  }

  makeWaypoint() {
    return new Waypoint(this.getX(), this.getY(), this.name + ", " + this.region);
  }

  toString() {
    return this.name + ", " + this.region + " (" + this.getX().toFixed(2) + ", " + this.getY().toFixed(2) + ")";
  }
}

export default LineMapFeature;
