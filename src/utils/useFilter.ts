import React from 'react';
import { FILTER_DEFAULT_VALUE, Filter, FilterContext } from './contexts';

export const useFilter = (): FilterContext => {
  const [filter, setFilter] = React.useState<Filter>(FILTER_DEFAULT_VALUE.filter);

  const filterDefaultValue = FILTER_DEFAULT_VALUE.filterDefaultValue;

  const setNewFilter = React.useCallback((newFilter: Filter): void => {
    setFilter(newFilter);
  }, []);

  return {
    filter,
    filterDefaultValue,
    setNewFilter,
  };
};
