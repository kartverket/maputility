import Vector2 from "./Vector2";
import LineSegment from "./LineSegment";

/**
* Class representing a point sequence curve
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class PointSequenceCurve {

  /**
  * Create a instance of PointSequenceCurve
  *
  * @constructor
  * @this {PointSequenceCurve}
  * @param {array} points
  */
  constructor(points) {
    this.points = list;
  }

  interpolate() {}

  /**
  * Create a offset of the curve represented by this instance
  * l
  * @this {PointSequenceCurve}
  * @param {array} area
  * @return {array}
  */
  makeOffsetCurve(area) {
    let result = [this.points[0]], i = 2, len = this.points.length - 1;
    let s0 = this.getPointNormalSegment(1, area[1]), s1 = this.getPointNormalSegment(2, area[2]);
    let l0 = new LineSegment(), l1 = new LineSegment();
    let buffer = [], t = -1;

    for(; i < len; i++) {
      s1 = this.getPointNormalSegment(i, area[i]);
      t = s0.intersectsLine(s1);

      if(t !== -1){
        // Line interference, filter out current normal



      } else {
        // no interference, build forward
        s0 = s1;

      }
    }

    result.push(this.points[len]);
    return result;
  }

  getPointNormalSegment(i, length) {
    let normal = this.getPointNormal(i);
    let point = this.points[i];
    let p0 = new Vector2(
      point.x + normal.x * length,
      point.y + normal.y * length
    ),
    p1 = new Vector2(
      point.x - normal.x * length,
      point.y - normal.y * length
    );

    return new LineSegment(p0, p1);
  }

  getPointNormal(i) {
    let a = this.points[i - 1], b = this.points[i], c = this.points[i + 1];
    let ba = new Vector2(a.x - b.x, a.y - b.y);
    let bc = new Vector2(c.x - b.x, c.y - b.y);
    let abc = new Vector2(ba.x + bc.x, ba.y + bc.y);
    abc.normalize();
    return abc;
  }
}

export default PointSequenceCurve;
