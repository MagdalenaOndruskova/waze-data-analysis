import React from 'react';
import dayjs from 'dayjs';
import { StreetFull } from '../types/StreetFull';
import { StreetInMap } from '../types/StreetInMap';

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
  setNewFilter: (newFilter: Filter) => void;
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
  setNewFilter: () => {},
};

export const filterContext = React.createContext<FilterContext>(FILTER_DEFAULT_VALUE);

export interface StreetContext {
  streetsInMap: StreetInMap[];
  streetsInSelected: string[];
  streetsWithLocation: StreetFull[];
  setNewStreetsInMap: (streetsInMap: StreetInMap[]) => void;
  setNewStreetsInSelected: (streetsInSelected: string[]) => void;
  setNewStreetsWithLocation: (streetsWithLocation: StreetFull[]) => void;
}

export const STREET_CONTEXT_DEFAULT_VALUE: StreetContext = {
  streetsInMap: [],
  streetsInSelected: [],
  streetsWithLocation: [],
  setNewStreetsInMap: () => {},
  setNewStreetsInSelected: () => {},
  setNewStreetsWithLocation: () => {},
};

export const streetContext = React.createContext<StreetContext>(STREET_CONTEXT_DEFAULT_VALUE);
