"use strict";


/**
* Pathfinder, Abstract Class
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class Pathfinder {

  constructor(db) {
    this.db = db;
  }

  setHeuristicParameters(attr) {}
  findShortestPath(a, b) {}
}

export default Pathfinder;
