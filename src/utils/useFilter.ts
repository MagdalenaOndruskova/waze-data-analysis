import React from 'react';
import { FILTER_DEFAULT_VALUE, Filter, FilterContext } from './contexts';
import { StreetFull } from '../types/StreetFull';
import { StreetInMap } from '../types/StreetInMap';

export const useFilter = (): FilterContext => {
  const [filter, setFilter] = React.useState<Filter>(FILTER_DEFAULT_VALUE.filter);
  const [streetsFromMap, setStreetsFromMap] = React.useState<string[]>(FILTER_DEFAULT_VALUE.streetsFromMap);
  const [streetsFromMapSelected, setStreetsFromMapSelected] = React.useState<string>(
    FILTER_DEFAULT_VALUE.streetsFromMapSelected,
  );
  const [streetsInMap, setStreetsInMap] = React.useState<StreetInMap[]>(FILTER_DEFAULT_VALUE.streetsInMap);
  const filterDefaultValue = FILTER_DEFAULT_VALUE.filterDefaultValue;

  const setNewFilter = React.useCallback((newFilter: Filter): void => {
    setFilter(newFilter);
  }, []);

  const setNewStreetsFromMap = React.useCallback((newStreets: string[]): void => {
    setStreetsFromMap(newStreets);
  }, []);

  const setNewStreetsFromMapSelected = React.useCallback((streetsFromMapSelected: string): void => {
    setStreetsFromMapSelected(streetsFromMapSelected);
  }, []);

  const setNewStreetsInMap = React.useCallback((streetsInMap: StreetInMap[]): void => {
    setStreetsInMap(streetsInMap);
  }, []);

  return {
    filter,
    filterDefaultValue,
    setNewFilter,
    streetsFromMap,
    setNewStreetsFromMap,
    streetsFromMapSelected,
    setNewStreetsFromMapSelected,
    streetsInMap,
    setNewStreetsInMap,
  };
};
