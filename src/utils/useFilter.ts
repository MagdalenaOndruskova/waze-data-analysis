import React from 'react';
import { FILTER_DEFAULT_VALUE, Filter, FilterContext } from './contexts';
import { StreetFull } from '../types/StreetFull';

export const useFilter = (): FilterContext => {
  const [filter, setFilter] = React.useState<Filter>(FILTER_DEFAULT_VALUE.filter);
  const [streetsFromMap, setStreetsFromMap] = React.useState<string[]>(FILTER_DEFAULT_VALUE.streetsFromMap);
  const [streetsFulls, setStreetsFulls] = React.useState<StreetFull[]>(FILTER_DEFAULT_VALUE.streetsFulls);
  const [streetsFromMapSelected, setStreetsFromMapSelected] = React.useState<string>(
    FILTER_DEFAULT_VALUE.streetsFromMapSelected,
  );
  const filterDefaultValue = FILTER_DEFAULT_VALUE.filterDefaultValue;

  const setNewFilter = React.useCallback((newFilter: Filter): void => {
    setFilter(newFilter);
  }, []);

  const setNewStreetsFromMap = React.useCallback((newStreets: string[]): void => {
    setStreetsFromMap(newStreets);
  }, []);

  const setNewStreetsFulls = React.useCallback((streetsFull: StreetFull[]): void => {
    setStreetsFulls(streetsFull);
  }, []);

  const setNewStreetsFromMapSelected = React.useCallback((streetsFromMapSelected: string): void => {
    setStreetsFromMapSelected(streetsFromMapSelected);
  }, []);

  return {
    filter,
    filterDefaultValue,
    setNewFilter,
    streetsFromMap,
    setNewStreetsFromMap,
    streetsFulls,
    setNewStreetsFulls,
    streetsFromMapSelected,
    setNewStreetsFromMapSelected,
  };
};
