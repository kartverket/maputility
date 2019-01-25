import Vector2 from "./Vector2";

/**
* Class representing a Waypoint
* @extends {Vector2}
* @version 0.0.2
* @since 0.0.2
*/
class Waypoint extends Vector2 {

  constructor(x, y, name, kommune, fylke) {
    super(x, y);
    this.name = name;
    this.kommune = kommune;
    this.fylke = fylke;
    this.clearance = 0.0025;
  }

  setClearance(clr) {
    this.clearance = clr;
  }

  getClearance() {
    return this.clearance;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setKommune(kommune) {
    this.kommune = kommune;
  }

  getKommune() {
    return this.kommune;
  }

  setFylke(fylke) {
    this.fylke = fylke;
  }

  getFylke() {
    return this.fylke;
  }

  // TODO: add kommune and fylke
  toString() {
    return (this.name ? this.name + " ": "") + "(" + super.toString() + ")";
  }

}

export default Waypoint;
