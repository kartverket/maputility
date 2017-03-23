import Point from "../geometry/Point";
import Waypoint from "../vector/Waypoint";


class PointMapFeature extends Point {

  /**
  *
  */
  constructor(type, feature) {
    super(feature.c[0], feature.c[1]);
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

export default PointMapFeature;
