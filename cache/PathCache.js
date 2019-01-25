import CacheElement from "./CacheElement";

/**
* Cache to store paths referenced by waypoint hashes
* @author Leif Andreas Rudlang
* @since 0.0.2
* @version 0.0.2
*/
class PathCache {

  /**
  * Create a instance of the PathCache
  *
  * @constructor
  * @this {PathCache}
  */
  constructor() {
    this.persist = null;
    this.volatile = {};
    this.timer = setInterval(() => this.update(), 1000 * 60);
  }

  /**
  * Update the cache, perform garbage collection
  *
  * @this {PathCache}
  */
  update() {
    let keys = Object.keys(this.volatile);
    let i = 0, element = null, key = "";

    for(; i < keys.length; i++) {
      key = keys[i];
      if(this.volatile.hasOwnProperty(key)) {
        element = this.volatile[key];
        if(--element.ttl <= 0) {
          delete this.volatile[key];
        }
      }
    }
  }

  /**
  * Store a object into the cache
  *
  * @this {PathCache}
  * @param {string} key
  * @param {object} data
  */
  set(key, data) {
    var element = new CacheElement();
    element.data = data;
    element.ttl = 3;
    this.volatile[key] = element;
  }

  /**
  * Retrieve a element from the cache
  *
  * @this {PathCache}
  * @param {string} key
  */
  get(key) {
    if(this.contains(key)) {
      let element = this.volatile[key];
      element.ttl = 1 + (element.ttl * element.ttl);
      return element.data;
    } else {
      return null;
    }
  }

  /**
  * Check if the cache contains a element
  *
  * @this {PathCache}
  * @param {string} key
  */
  contains(key) {
    if(this.volatile.hasOwnProperty(key)) {
      this.volatile[key].ttl++;
      return true;
    }
    return false;
  }

}

export default PathCache;
