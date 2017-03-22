import Geometry from "../geometry/Geometry";
"use strict";

/**
* Vertice, Geometry object representing a graph-vertice
* @extends Geometry
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Vertice extends Geometry {

  /**
  * Creates a instance of the Vertice class
  *
  * @constructor
  * @this {BinaryHeap}
  * @param {number} x X-Coordinate
  * @param {number} y Y-Coordinate
  */
  constructor(x, y) {
    super();
    this.setX(x);
    this.setY(y);
    this.index = 0;
    this.adj = null;
    this.gScore = Number.MAX_VALUE;
    this.fScore = Number.MAX_VALUE;
    this.cameFrom = null;
    this.clr = 0;
  }

  /**
  * Reset the vertice so that a new path search can be performed on it
  *
  * @this {Vertice}
  */
  reset() {
    this.gScore = Number.MAX_VALUE;
    this.fScore = Number.MAX_VALUE;
    this.cameFrom = null;
  }

  /**
  * Calculate the distance to the input vertice
  *
  * @this {Vertice}
  * @param {Vertice} vertice
  * @return {number}
  */
  distanceTo(vertice) {
    return this.position.fgDistance(vertice.position);
  }

  /**
  * Cost of travel from current to input vertice
  *
  * @this {Vertice}
  * @param {Vertice} vertice
  * @return {number}
  */
  costTo(vertice) {
    return 1; // TODO heuristic based on (edge + node)(Weather conditions, waves, also have traversal paramaters on edge based on ship size)
  }

  /**
  * Approximate heuristcal cost to travel to the input vertice from the current vertice
  *
  * @this {Vertice}
  * @param {Vertice} vertice
  * @return {number}
  */
  heuristicTo(vertice) {
    return this.distanceTo(vertice) * this.costTo(vertice);
  }

}

export default Vertice;
