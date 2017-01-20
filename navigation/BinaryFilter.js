
/**
* BinaryFilter, Structure to rapidly insert values into a sorted list, and to determine if the list contains the given value
* @author Leif Andreas Rudlang
* @version 0.0.1
* @since 0.0.1
*/
class BinaryFilter {

  /**
  * Creates a instance of the Binary Heap class
  *
  * @this {BinaryFilter}
  */
  constructor() {
    this.filter = [];
  }

  /**
  * Inserts a value into the heap
  *
  * @this {BinaryFilter}
  * @param {number} value
  */
  add(val) {

    var len = this.filter.length;

    if(len === 0) {
      this.filter.push(val);
      return;
    }

    var min = 0, max = len - 1, curr = 0, index = 0;

    while( min <= max ) {
      index = (min + max) / 2 | 0;
      curr = this.filter[index];

      if(curr < val) {
        min = index + 1;
        if(min > max) {
          this.filter.splice(min, 0, val);
          return;
        }

      }else if(curr > val) {
        max = index - 1;
        if(max < max) {
          this.filter.splice(index, 0, val);
          return;
        }

      }else {
        this.filter.splice(index, 0, val);
        return;
      }
    }

    this.filter.splice(index, 0, val);
  }

  /**
  * Returns the index of a given value in the Heap
  *
  * @this {BinaryFilter}
  * @param {number} value
  * @return {number} Index of value in heap, -1 if not found
  */
  indexOf(val) {
    var len = this.filter.length;

    if(len === 0) {
      return -1;
    }

    var min = 0, max = len - 1, curr = 0, index = 0;

    while( min <= max ) {
      index = (min + max) / 2 | 0;
      curr = this.filter[index];
      if(curr < val) {
        min = index + 1;
      }else if(curr > val) {
        max = index - 1;
      }else {
        return index;
      }
    }

    return -1;
  }

  /**
  * Clears all data from the heap
  *
  * @this {BinaryFilter}
  */
  clear() {
    this.filter = [];
  }

  /**
  * Checks if a element exists in the heap
  *
  * @this {BinaryFilter}
  * @param {number} value
  * @return {boolean} Returns true of the value exists in the heap
  */
  contains(val) {
    return this.indexOf(val) !== -1;
  }

  /**
  * Returns the number of elements in the heap
  *
  * @this {BinaryFilter}
  * @return {number} Length
  */
  length() {
    return this.filter.length;
  }

  /**
  * Returns the backing array of the heap
  *
  * @this {BinaryFilter}
  * @return {array}
  */
  list() {
    return this.filter;
  }

  /**
  * Returns the lowest value in the heap
  *
  * @this {BinaryFilter}
  * @return {number}
  */
  peekMin() {
    return this.filter[0];
  }

  /**
  * Removes and returns the lowest value in the heap
  *
  * @this {BinaryFilter}
  * @return {number}
  */
  popMin() {
    return this.filter.shift();
  }

  /**
  * Returns the highest value in the heap
  *
  * @this {BinaryFilter}
  * @return {number}
  */
  peekMax() {
    return this.filter[this.filter.length - 1];
  }

  /**
  * Removes and returns the highest value in the heap
  *
  * @this {BinaryFilter}
  * @return {number}
  */
  popMax() {
    return this.filter.pop();
  }

  /**
  * Removes a value from the heap
  *
  * @this {BinaryFilter}
  * @param {number} value
  */
  remove(val) {
    var index = this.indexOf(val);
    if(index !== -1) {
      this.filter.splice(index, 1);
    }
  }

}

export default BinaryFilter;
