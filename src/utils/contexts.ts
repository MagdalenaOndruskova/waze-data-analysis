import React from 'react';
import dayjs from 'dayjs';

export interface Filter {
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  streets: Array<String>;
}

export interface FilterContext {
  filter: Filter | null;
  filterDefaultValue: Filter;
  streetsFromMap: string[];
  setNewFilter: (newFilter: Filter) => void;
  setNewStreetsFromMap: (streetValues: string[]) => void;
}

export const FILTER_DEFAULT_VALUE: FilterContext = {
  filterDefaultValue: {
    fromDate: dayjs().add(-7, 'd').format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD'),
    fromTime: dayjs('08:00', 'HH:mm').format('HH:mm'),
    toTime: dayjs('08:00', 'HH:mm').format('HH:mm'),
    streets: [],
  },
  filter: null,
  streetsFromMap: [],
  setNewStreetsFromMap: () => {},
  setNewFilter: () => {},
};

export const filterContext = React.createContext<FilterContext>(FILTER_DEFAULT_VALUE);
