import RoutePlotter from "./RoutePlotter";
import GeometryCache from "../geometry/GeometryCache";
import RouteRenderer from "./RouteRenderer";
import EventEmitter from "EventEmitter";
import * as Updates from "../constants/Updates";
"use strict";

/**
* Class representing a collection of Routes
* @author Leif Andreas Rudlang
* @extends {EventEmitter}
* @version 0.0.3
* @since 0.0.3
* @todo Refactor navigation api, a route is origin->destination, with offsets represented by waypoints in the form of routesegments
*/
class Voyage extends EventEmitter {

  constructor() {
    super();
    this.plotter = new RoutePlotter();
    this.cache = new GeometryCache();
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

  pop(call) {
    this.waypoints.pop();
    if(this.routes.length !== 0) {
      this.routes.pop();
      this.emit(Updates.PLOTTER_UPDATE);
    }
    call();
  }

  set(index, waypoint) {
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

  segmentRoute(index, waypoint) {
    
  }

  deSegmentRoute() {

  }

  clear() {
    this.routes = [];
    this.waypoints = [];
  }

  getRoutes() {
    return this.routes;
  }

  getWaypoints() {
    return this.waypoints;
  }

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
