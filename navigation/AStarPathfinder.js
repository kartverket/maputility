import Pathfinder from "./Pathfinder";
import PriorityQueue from "priorityqueuejs";
import BinaryFilter from "./BinaryFilter";
import Vector2 from "../vector/Vector2";
import Waypoint from "../vector/Waypoint";

/**
* AStarPathfinder, class to perform pathfinding using the A* Algorithm
* @extends Pathfinder
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class AStarPathfinder extends Pathfinder {

  /**
  * Creates a instance of the class AStarPathfinder
  *
  * @constructor
  * @this {AStarPathfinder}
  */
  constructor(db) {
    super(db);
  }

  /**
  * Locate the shortest path from start to end using A*
  *
  * @this {AStarPathfinder}
  * @param {Vertice} start Route origin vertice
  * @param {Vertice} end Route destination vertice
  * @return {array} Array of route coordinates {x, y, index}, null if route not available
  */
  findShortestPath(start, end) {
    // TODO more optimal way of combining filter with PriorityQueue
    var current = null, i = 0, adjacent = null, node = null;
    start.gScore = 0;
    start.fScore = start.heuristicTo(end);

    var openSet = new PriorityQueue((a, b)=>{
      return b.fScore - a.fScore;
    });

    var closedFilter = new BinaryFilter();
    var openFilter = new BinaryFilter();
    openSet.enq(start);
    openFilter.add(start.index);

    while(openSet.size() !== 0) {
      current = openSet.deq();
      openFilter.remove(current.index);

      if(current === end) {
        return this.reconstructPath(start, end);
      }

      closedFilter.add(current.index);
      adjacent = current.adj;

      for(i = 0; i < adjacent.length; i++) {
        var adjacentIndex = adjacent[i];
        node = this.db.getVerticeById(adjacentIndex);

        if(closedFilter.contains(adjacentIndex)) {
          continue;
        }

        var tentativeScore = current.gScore + (current.distanceTo(node) * this.heuristic(current, node));

        if(!openFilter.contains(adjacentIndex)) {
          openSet.enq(node);
          openFilter.add(adjacentIndex);
        }else if (tentativeScore >= node.gScore) {
          continue;
        }

        node.cameFrom = current;
        node.gScore = tentativeScore;
        node.fScore = tentativeScore + node.distanceTo(end);
      }
    }

    this.db.reset();
    return null;
  }

  /**
  * Reconstruct the path from end to start
  *
  * @this {AStarPathfinder}
  * @param {Vertice} start Start vertice
  * @param {Vertice} end End vertic
  * @return {array} {array} Array of route coordinates {x, y, index}
  */
  reconstructPath(start, end) {
    var endwp = new Waypoint(end.position.x, end.position.y);
    endwp.setClearance(end.clr);
    var path = [endwp], curr = end, nwp = null;
    while(curr !== start && curr.cameFrom !== null) {
      curr = curr.cameFrom;
      nwp = new Waypoint(curr.position.x, curr.position.y);
      nwp.setClearance(curr.clr);
      path.unshift(nwp);
    }
    this.db.reset();
    return path;
  }

  /**
  * Get the cost of travelling from vertice A to vertice B
  *
  * @this {AStarPathfinder}
  * @param {Vertice} a
  * @param {Vertice} b
  * @return {number} Cost of travel
  */
  heuristic(a, b) {
    return 1;
    //var data = this.db.getEdgeData(a.index, b.index);
    //return data !== null ? data : 1;
  }

}


export default AStarPathfinder;
