import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: L.LatLng[];
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      fitSelectedRoutes?: boolean;
      lineOptions?: {
        styles?: {
          color: string;
          weight: number;
        }[];
      };
      createMarker?: (i: number, waypoint: any, n: number) => L.Marker | null;
    }

    class Control extends L.Control {
      constructor(options: RoutingControlOptions);
      getPlan(): any;
      getRouter(): any;
      route(): void;
    }
  }

  namespace Control {
    class Routing extends L.Routing.Control {}
  }
}
