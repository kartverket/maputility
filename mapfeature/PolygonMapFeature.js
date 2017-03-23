import Polygon from "../geometry/Polygon";
import Waypoint from "../vector/Waypoint";


class PolygonMapFeature extends Polygon {

  /**
  *
  */
  constructor(type, feature) {
    super(feature.c);
    this.name = feature.n;
    this.region = feature.r;
    this.type = type;
  }

  render(id, image) {
    return {
      id: id,
      coordinates: this.points,
      type: "polygon",
      fillColor: "red",
      fillAlpha: 0.25,
      alpha: 0.25
    };
  }

  makeWaypoint() {
    return new Waypoint(this.getX(), this.getY(), this.name + ", " + this.region);
  }

  toString() {
    return this.name + ", " + this.region + " (" + this.getX().toFixed(2) + ", " + this.getY().toFixed(2) + ")";
  }
}

export default PolygonMapFeature;
