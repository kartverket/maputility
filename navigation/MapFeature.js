import Point from "../geometry/Point";


class MapFeature extends Point {

  /**
  *
  */
  constructor(type, feature) {
    super(feature.c[0], feature.c[1]);
    this.name = feature.d.Name;
    this.type = type;
  }

  render(id) {
    return {
      id: id,
      coordinates: this.position.toArray(),
      type: "point",
      title: this.name,
      subtitle: this.type,
      rightCalloutAccessory: {
        source: { uri: "https://cldup.com/9Lp0EaBw5s.png" },
        height: 25,
        width: 25
      }
    };
  }
}

export default MapFeature;
