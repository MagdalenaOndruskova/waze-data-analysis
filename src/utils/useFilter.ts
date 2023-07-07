import React from 'react';
import { FILTER_DEFAULT_VALUE, Filter, FilterContext } from './contexts';

export const useFilter = (): FilterContext => {
  const [filter, setFilter] = React.useState<Filter>(FILTER_DEFAULT_VALUE.filter);
  const [streetsFromMap, setStreetsFromMap] = React.useState<string[]>(FILTER_DEFAULT_VALUE.streetsFromMap);
  const filterDefaultValue = FILTER_DEFAULT_VALUE.filterDefaultValue;

  const setNewFilter = React.useCallback((newFilter: Filter): void => {
    setFilter(newFilter);
  }, []);

  const setNewStreetsFromMap = React.useCallback((newStreets: string[]): void => {
    setStreetsFromMap(newStreets);
  }, []);

  return { filter, filterDefaultValue, setNewFilter, streetsFromMap, setNewStreetsFromMap };
};
