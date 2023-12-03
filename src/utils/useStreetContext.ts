import React from 'react';
import { StreetInMap } from '../types/StreetInMap';
import { STREET_CONTEXT_DEFAULT_VALUE, StreetContext } from './contexts';

export const useStreetContext = (): StreetContext => {
  const [streetsInMap, setStreetsInMap] = React.useState<StreetInMap[]>(STREET_CONTEXT_DEFAULT_VALUE.streetsInMap);
  const [streetsInSelected, setStreetsInSelected] = React.useState<string[]>(
    STREET_CONTEXT_DEFAULT_VALUE.streetsInSelected,
  );

  const setNewStreetsInMap = React.useCallback((streetsInMap: StreetInMap[]): void => {
    setStreetsInMap(streetsInMap);
  }, []);

  const setNewStreetsInSelected = React.useCallback((streetsInSelected: string[]): void => {
    setStreetsInSelected(streetsInSelected);
  }, []);

  return {
    streetsInMap,
    streetsInSelected,
    setNewStreetsInMap,
    setNewStreetsInSelected,
  };
};
