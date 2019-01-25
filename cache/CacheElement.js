/**
* Element to store in cache
* @author Leif Andreas Rudlang
* @since 0.0.2
* @version 0.0.2
*/
class CacheElement {

  /**
  * Create a instance of CacheElement
  *
  * @constructor
  * @this {CacheElement}
  */
  constructor() {
    this.ttl = 0;
    this.key = "";
    this.data = null;
  }

}

export default CacheElement;
