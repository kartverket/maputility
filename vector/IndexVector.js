import Vector2 from "./Vector2";

/**
* Class representing a Vector with a index property referencing the navmesh database
* @extends {Vector2}
* @version 0.0.2
* @since 0.0.2
*/
class IndexVector extends Vector2 {

  constructor(x, y, index) {
    super(x, y);
    this.index = index;
  }

  setIndex(index) {
    this.index = index;
  }

  getIndex() {
    return this.Index;
  }

  toString() {
    return "[" + this.index + "] (" + super.toString() + ")";
  }

}

export default IndexVector;
