import RoutePlotter from "./RoutePlotter";
import GeometryCache from "../geometry/GeometryCache";
import MapFeatures from "./MapFeatures";
import EventEmitter from "EventEmitter";
import Segmentation from "./Segmentation";
import * as Updates from "../constants/Updates";
"use strict";

/**
* Class representing a collection of Routes
* @author Leif Andreas Rudlang
* @extends {EventEmitter}
* @version 0.0.3
* @since 0.0.3
*/
class Voyage extends EventEmitter {

  /**
  * Create a instance of the Voyage class
  *
  * @constructor
  * @this {Voyage}
  */
  constructor() {
    super();
    this.plotter = new RoutePlotter();
    this.cache = new GeometryCache();
    this.features = new MapFeatures();
    this.features.load();
    this.transactions = [];
    this.waypoints = [];
    this.routes = [];
  }

  onPlotterUpdate(err, route) {
    if(err) {
      this.emit(Updates.PLOTTER_ERROR, err);
    } else {
      this.emit(Updates.PLOTTER_UPDATE, route);
    }
  }

  /**
  * Push a new waypoint to the end of the Voyage
  *
  * @this {Voyage}
  * @param {Vector2} waypoint
  * @param {requestCallback} call
  */
  push(waypoint, call) {
    this.waypoints.push(waypoint);
    let len = this.waypoints.length - 1;
    if(len > 0) {
      this.plotter.plot(
        [
          this.waypoints[len - 1],
          this.waypoints[len]
        ],
        (err, route)=>{
          if(!err) {
            this.routes.push(route);
          }
          this.onPlotterUpdate(err, route);
          call(err, route);
        }
      );
    }
  }

  /**
  * Remove the last waypoint from the journey
  *
  * @this {Voyage}
  * @param {requestCallback}
  */
  pop(call) {
    this.waypoints.pop();
    if(this.routes.length !== 0) {
      this.routes.pop();
      this.emit(Updates.PLOTTER_UPDATE);
    }
    call();
  }


  /**
  * Set the waypoint at the given position
  *
  * @this {Voyage}
  * @param {number} index
  * @param {Vector2} waypoint
  * @param {requestCallback} call
  */
  set(index, waypoint, call) {
    let len = this.waypoints.length;
    if(index === 0 && len !== 0) {
      this.waypoints[0] = waypoint;
      if(len > 1) {
        this.plotter.plot(
          [
            this.wayopints[0],
            this.waypoints[1]
          ],
          (err, route)=>{
            if(!err) {
              this.routes[0] = route;
            }
            this.onPlotterUpdate(err, route);
            call(err, route);
          }
        );
      }
    } else if(index >= len) {
      this.push(waypoint, call);
    } else {
      this.waypoints[index] = waypoint;
      if(index > 0) {
        this.plotter.plot(
          [
            this.waypoints[index - 1],
            this.waypoints[index]
          ],
          (err, route)=>{
            if(!err) {
              this.routes[index - 1] = route;
            }
            this.onPlotterUpdate(err, route);
            call(err, route);
          }
        );
      }
      if(index < len - 1) {
        this.plotter.plot(
          [
            this.waypoints[index],
            this.waypoints[index + 1]
          ],
          (err, route)=>{
            if(!err) {
              this.routes[index] = route;
            }
            this.onPlotterUpdate(err, route);
            call(err, route);
          }
        );
      }
    }
  }

  /**
  * Remove the waypoint at the given index
  *
  * @this {Voyage}
  * @param {number} index
  * @param {requestCallback} call
  */
  remove(index, call) {
    let wp = this.waypoints.splice(index, 1);
    if(this.waypoints.length !== 0) {
      this.routes.splice(index - 1 , 1);
      if(index > 0 && index < this.waypoints.length){
        this.plotter.plot(
          [
            this.waypoints[index - 1],
            this.waypoints[index]
          ],
          (err, route)=>{
            if(!err) {
              this.routes[index - 1] = route;
            }
            this.onPlotterUpdate(err, route);
            call(err, route);
          }
        );
      }else{
        this.emit(Updates.PLOTTER_UPDATE);
        call();
      }
    }else{
      call();
    }
  }

  /**
  * Create a segmentation at the specfied position
  *
  * @this {Voyage}
  * @param {Vector2} vec2
  * @param {requestCallback} call (error, segmentation)
  */
  makeSegmentation(vec2, call) {

    if(this.routes.length === 0) {
      call("You need to specify atleast 2 points before segmenting", null);
      return;
    }

    var cwp = this.getClosestPoint(vec2);
    var route = this.routes[cwp[0]], point = route.path[cwp[1]];
    var wps = route.waypoints, segments = route.segments;
    var arr = [], dist = 0, min = Number.MAX_VALUE, segment = 0;

    for(var i = 0; i < route.segments.length; i++) {
      dist = segments[i].distanceTo(point);
      if(dist < min) {
        min = dist;
        segment = i;
      }
    }

    let s = new Segmentation(cwp[0], segment + 1, wps);
    s.setPosition(point.x, point.y);
    call(null, s);
  }

  /**
  * Apply a segmentation
  *
  * @this {Voyage}
  * @param {Segmentation} segmentation
  * @param {requestCallback} call (error, route)
  */
  segment(segmentation, call) {
    this.plotter.plot(segmentation.waypoints, (err, result)=>{
      if(!err) {
        this.routes[segmentation.route] = result;
      }
      this.onPlotterUpdate(err, result);
      call(err, result);
    });
  }

  /**
  * Clear route and waypoint data from this instance
  *
  * @this {Voyage}
  */
  clear() {
    this.routes = [];
    this.waypoints = [];
  }

  /**
  * Get the backing mapfeatures object
  *
  * @this {Voyage}
  * @return {MapFeatures}
  */
  getFeatures() {
    return this.features;
  }


  /**
  * Get the backing route array
  *
  * @this {Voyage}
  * @return {array}
  */
  getRoutes() {
    return this.routes;
  }

  /**
  * Get the backing waypoint array
  *
  * @this {Voyage}
  * @return {array}
  */
  getWaypoints() {
    return this.waypoints;
  }

  /**
  * Get the closest point in voyage to input coordinate
  *
  * @this {Voyage}
  * @param {Vector2} vec2
  * @return {array} [route index, path index]
  */
  getClosestPoint(vec2) {
    let min = Number.MAX_VALUE, len = this.routes.length;
    let dist = 0, rCurrent = -1, pCurrent = -1, i = 0, j = 0, route = null, path = null;

    for(; i < len; i++) {
      route = this.routes[i];
      path = route.path;
      for(j = 0; j < path.length; j++) {
        dist = vec2.distance(path[j]);
        if(dist < min) {
          min = dist;
          rCurrent = i;
          pCurrent = j;
        }
      }
    }

    return [rCurrent, pCurrent];
  }

  /**
  * get a array of mapbox annotations
  *
  * @this {Voyage}
  * @return {array}
  */
  render() {
    let result = [], i = 0, len = this.routes.length;
    for(; i < len; i++) {
      result = result.concat(this.routes[i].render(i));
    }
    return result;
  }
}

export {
  Voyage as default
};
