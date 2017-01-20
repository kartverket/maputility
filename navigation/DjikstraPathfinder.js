import Pathfinder from "./Pathfinder";
import BinaryHeap from "./BinaryHeap";

/**
 * DjikstraPathfinder, class to perform pathfinding using the Djikstra algorithm, used for reference as a test case against the AStarPathfinder to make sure it finds the optimal path
 * @extends Pathfinder
 * @author Leif Andreas Rudlang
 * @version 0.0.1
 * @since 0.0.1
 */
class DjikstraPathfinder extends Pathfinder {

  /**
  * Creates a instance of the class DjikstraPathfinder
  *
  * @this {DjikstraPathfinder}
  */
  constructor(db) {
    super(db);
  }

  /**
  * Locate the shortest path from start to end using A*
  *
  * @this {DjikstraPathfinder}
  * @param {Vertice} start Route origin vertice
  * @param {Vertice} end Route destination vertice
  * @return {array} Array of route coordinates {x, y, index}, null if route not available
  */
  findShortestPath(start, end) {
    var current = null, i = 0, adjacent = null, node = null;
    this.db.reset();

    var heap = new BinaryHeap();
    heap.add(start.index);

    while(heap.length() !== 0) {
      node = heap.popMin();

      
    }



    return null;
  }

/*
1  function Dijkstra(Graph, source):
2      dist[source] ← 0                                    // Initialization
3
4      create vertex set Q
5
6      for each vertex v in Graph:
7          if v ≠ source
8              dist[v] ← INFINITY                          // Unknown distance from source to v
9              prev[v] ← UNDEFINED                         // Predecessor of v
10
11         Q.add_with_priority(v, dist[v])
12
13
14     while Q is not empty:                              // The main loop
15         u ← Q.extract_min()                            // Remove and return best vertex
16         for each neighbor v of u:                       // only v that is still in Q
17             alt = dist[u] + length(u, v)
18             if alt < dist[v]
19                 dist[v] ← alt
20                 prev[v] ← u
21                 Q.decrease_priority(v, alt)
22
23     return dist[], prev[]
*/



  /**
  * Reconstruct the path from end to start
  *
  * @this {DjikstraPathfinder}
  * @param {Vertice} start Start vertice
  * @param {Vertice} end End vertic
  * @return {array} {array} Array of route coordinates {x, y, index}
  */
  reconstructPath(start, end) {

  }

  /**
  * Get the cost of travelling from vertice A to vertice B
  *
  * @this {DjikstraPathfinder}
  * @param {Vertice} a
  * @param {Vertice} b
  * @return {number} Cost of travel
  */
  heuristic(a, b) {
    var data = this.db.getEdgeData(a.index, b.index);
    return data !== null ? data : 1;
  }

}


export default DjikstraPathfinder;
