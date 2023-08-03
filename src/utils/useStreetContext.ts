import React from 'react';
import { StreetInMap } from '../types/StreetInMap';
import { STREET_CONTEXT_DEFAULT_VALUE, StreetContext } from './contexts';
import { StreetFull } from '../types/StreetFull';

export const useStreetContext = (): StreetContext => {
  /**
     * streetsInMap: StreetInMap[];
  streetsInSelected: string[];
  streetsWithLocation: StreetFull[];
     */
  const [streetsInMap, setStreetsInMap] = React.useState<StreetInMap[]>(STREET_CONTEXT_DEFAULT_VALUE.streetsInMap);
  const [streetsInSelected, setStreetsInSelected] = React.useState<string[]>(
    STREET_CONTEXT_DEFAULT_VALUE.streetsInSelected,
  );
  const [streetsWithLocation, setStreetsWithLocation] = React.useState<StreetFull[]>(
    STREET_CONTEXT_DEFAULT_VALUE.streetsWithLocation,
  );

  const setNewStreetsInMap = React.useCallback((streetsInMap: StreetInMap[]): void => {
    setStreetsInMap(streetsInMap);
  }, []);

  const setNewStreetsInSelected = React.useCallback((streetsInSelected: string[]): void => {
    setStreetsInSelected(streetsInSelected);
  }, []);

  const setNewStreetsWithLocation = React.useCallback((streetsWithLocation: StreetFull[]): void => {
    setStreetsWithLocation(streetsWithLocation);
  }, []);

  return {
    streetsInMap,
    streetsInSelected,
    streetsWithLocation,
    setNewStreetsInMap,
    setNewStreetsInSelected,
    setNewStreetsWithLocation,
  };
};
