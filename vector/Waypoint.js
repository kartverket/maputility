import Vector2 from "./Vector2";


class Waypoint extends Vector2 {

  constructor(x, y, data) {
    super(x, y);
    this.data = data;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  toString() {
    return (this.data ? this.data + " ": "") + "(" + super.toString() + ")";
  }
}

export default Waypoint;
