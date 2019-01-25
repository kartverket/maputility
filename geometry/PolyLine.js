import Geometry from "./Geometry";

/**
* PolyLine, Geometry object representing a polyline
* @extends Geometry
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class PolyLine extends Geometry {

  constructor(list) {
    super();
    this.list = list;
  }


}

export default PolyLine;
