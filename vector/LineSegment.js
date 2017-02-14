import Vector2 from "./Vector2";

/**
* Class representing a geometric line segment
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class LineSegment {

  /**
  * Create instance of the LineSegment class
  *
  * @constructor
  * @this {LineSegment}
  * @param {Vector2} start Start coordinate
  * @param {Vector2} end End coordinate
  */
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.delta = new Vector2(end.x - start.x, end.y - start.y);
    this.length = this.delta.length();
  }

  /**
  * Check for intersection between this and the input line segment
  *
  * @this {LineSegment}
  * @param {LineSegment} l Input line segment to check for intersection with this line
  * @return {number} -1 if no intersection, else number between 0 and 1 determining position on segment, replicate intersection position with this.start + this.delta * result
  */
  intersectsLine(l) {
    let denominator = (l.delta.y * this.delta.x) - (l.delta.x * this.delta.y);
    if(denominator === 0) {
      return null;
    }

    let a = this.start.y - l.start.y;
    let b = this.start.x - l.start.x;
    let numerator1 = (l.delta.x * a) - (l.delta.y * b);
    let numerator2 = (this.delta.x * a) - (this.delta.y * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    return (a > 0 && a <= 1) && (b > 0 && b <= 1) ? a : -1;
  }
}

export default LineSegment;
