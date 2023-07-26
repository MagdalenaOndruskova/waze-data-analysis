import React from 'react';
import dayjs from 'dayjs';
import { StreetFull } from '../types/StreetFull';

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
  streetsFulls: StreetFull[];
  streetsFromMapSelected: string;
  setNewFilter: (newFilter: Filter) => void;
  setNewStreetsFromMap: (streetValues: string[]) => void;
  setNewStreetsFulls: (streetsFulls: StreetFull[]) => void;
  setNewStreetsFromMapSelected: (streetsFromMapSelected: string) => void;
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
  streetsFulls: [],
  streetsFromMapSelected: '',
  setNewStreetsFromMap: () => {},
  setNewFilter: () => {},
  setNewStreetsFulls: () => {},
  setNewStreetsFromMapSelected: () => {},
};

export const filterContext = React.createContext<FilterContext>(FILTER_DEFAULT_VALUE);
