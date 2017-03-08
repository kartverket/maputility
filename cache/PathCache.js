import CacheElement from "./CacheElement";
"use strict";

class PathCache {

  constructor() {
    this.persist = null;
    this.volatile = {};
    this.timer = setInterval(() => this.update(), 1000 * 60);
  }

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

  set(key, data) {
    var element = new CacheElement();
    element.data = data;
    element.ttl = 3;
    this.volatile[key] = element;
  }

  get(key) {
    if(this.contains(key)) {
      let element = this.volatile[key];
      element.ttl = 1 + (element.ttl * element.ttl);
      return element.data;
    } else {
      return null;
    }
  }

  contains(key) {
    if(this.volatile.hasOwnProperty(key)) {
      this.volatile[key].ttl++;
      return true;
    }
    return false;
  }

}

export default PathCache;
