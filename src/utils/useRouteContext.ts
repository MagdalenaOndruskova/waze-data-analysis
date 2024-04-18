import React from 'react';
import { ROUTE_CONTEXT_DEFAULT_VALUE, RouteContext } from './contexts';
import { Coord } from '../types/baseTypes';

export const useRouteContext = (): RouteContext => {
  const [route, setRoute] = React.useState<any[]>(ROUTE_CONTEXT_DEFAULT_VALUE.route);
  const [coordinates, setCoordinates] = React.useState<Coord[]>(ROUTE_CONTEXT_DEFAULT_VALUE.coordinates);

  const setNewRoute = React.useCallback((route: any[]): void => {
    setRoute(route);
  }, []);

  const setNewCoordinates = React.useCallback((coord: Coord[]): void => {
    setCoordinates(coord);
  }, []);

  return {
    route,
    coordinates,
    setNewRoute,
    setNewCoordinates,
  };
};
