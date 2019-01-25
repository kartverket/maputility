import jstoxml from "jstoxml";

/**
* Class to generate and represent a route following the ECDIS Standard
* @author Leif Andreas Rudlang
* @version 0.0.2
* @since 0.0.2
*/
class ECDISRoute {

  constructor(route) {
    this.route = route;
    this.json = {};
  }

  make() {

  }

  import(data) {

  }

  export() {
    return jstoxml.toXML({
      _name: "xsd:schema",
      _attrs: {
        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "xmlns": "http://www.cirm.org/RTZ/1/0",
        "targetNamespace": "http://www.cirm.org/RTZ/1/0",
        "elementFormDefault": "qualified"
      },
      _content: {

      }
    }, {indent: " "});
  }

}


export default ECDISRoute;
