/**
* Class used to render mapfeatures into mapbox annotations
* @author Leif Andreas Rudlang
* @version 0.0.3
* @since 0.0.3
*/
class MapFeatureRenderer {

  /**
  * Create a instance of MapFeatureRenderer
  *
  * @constructor
  * @this {MapFeatureRenderer}
  */
  constructor() {
    this.map = {};
    this.prefix = "feature";
  }

  /**
  * Map a image to a map feature type
  *
  * @this {MapFeatureRenderer}
  * @param {string} type
  * @param {string} image
  */
  setType(type, image) {
    this.map[type] = image;
  }

  /**
  * Get the mapping to a mapfeature type
  *
  * @this {MapFeatureRenderer}
  * @param {string} type
  * @return {string} mapping
  */
  getType(type) {
    return this.map[type];
  }

  types() {
    return Object.keys(this.map);
  }

  /**
  * Remove the mapping to a type
  *
  * @this {MapFeatureRenderer}
  * @param {string} type
  */
  removeType(type) {
    delete this.map[type];
  }

  /**
  * Set the prefix used when generating annotation id's
  *
  * @this {MapFeatureRenderer}
  * @param {string} prefix
  */
  setPrefix(prefix) {
    this.prefix = prefix;
  }

  /**
  * Get the prefix used when generating annotation id's
  *
  * @this {MapFeatureRenderer}
  * @return {string} the prefix
  */
  getPrefix() {
    return this.prefix;
  }

  getImage(type) {
    if(this.map.hasOwnProperty(type)) {
      var source = this.map[type];
      return {
        source: { uri: source },
        height: 30,
        width: 25
      };
    }

    return {
      height: 25,
      width: 25
    };
  }

  /**
  * Render a array of mapfeatures into a array of annotations
  *
  * @this {MapFeatureRenderer}
  * @param {array} [mapfeature]
  * @return {array} [annotation]
  */
  render(features) {
    var arr = [],
        i = 0;
        // image = null;

    for(; i < features.length; i++) {
        arr.push(features[i].render(this.prefix + i, this.getImage(features[i].type)));
    }
    return arr;
  }

}

export default MapFeatureRenderer;
