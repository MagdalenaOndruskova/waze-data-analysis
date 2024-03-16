import React from 'react';
import dayjs from 'dayjs';
import { StreetInMap } from '../types/StreetInMap';

export interface Filter {
  fromDate: string;
  toDate: string;
  streets: Array<String>;
}

export interface FilterContext {
  filter: Filter | null;
  filterDefaultValue: Filter;
  setNewFilter: React.Dispatch<React.SetStateAction<Filter>>;
}

export const FILTER_DEFAULT_VALUE: FilterContext = {
  filterDefaultValue: {
    fromDate: dayjs().add(-7, 'd').format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD'),
    streets: [],
  },
  filter: null,
  setNewFilter: () => {},
};

export const filterContext = React.createContext<FilterContext>(FILTER_DEFAULT_VALUE);

export interface StreetContext {
  streetsInMap: StreetInMap[];
  streetsInSelected: string[];
  setNewStreetsInMap: React.Dispatch<React.SetStateAction<StreetInMap[]>>;
  setNewStreetsInSelected: (streetsInSelected: string[]) => void;
  newlySelected: string;
  setNewNewlySelected: (selected: string) => void;
  streetsInRoute: string[];
  setNewStreetsInRoute: React.Dispatch<React.SetStateAction<string[]>>;
}

export const STREET_CONTEXT_DEFAULT_VALUE: StreetContext = {
  streetsInMap: [],
  streetsInSelected: [],
  newlySelected: '',
  streetsInRoute: [],
  setNewStreetsInMap: () => {},
  setNewStreetsInSelected: () => {},
  setNewNewlySelected: () => {},
  setNewStreetsInRoute: () => {},
};

export const streetContext = React.createContext<StreetContext>(STREET_CONTEXT_DEFAULT_VALUE);

export interface DataContext {
  dateTimeFrom: string;
  dateTimeTo: string;
  previousDate: string;
  xAxisData: [];
  jamsData: [];
  alertData: [];
  levelData: [];
  speedData: [];
  lengthData: [];
  timeData: [];
  alertTypes: {};
  fullAlerts: [];
  fullJams: [];
  fullXAxis: [];

  setDateTimeFrom: (dateTime: string) => void;
  setDateTimeTo: (dateTime: string) => void;
  setPreviousDate: (date: string) => void;
  setXAxisData: (xAxisData: []) => void;
  setJamsData: (data: []) => void;
  setAlertData: (data: []) => void;
  setLevelData: (data: []) => void;
  setSpeedData: (data: []) => void;
  setLengthData: (data: []) => void;
  setTimeData: (data: []) => void;
  setAlertTypes: (data: {}) => void;
  setFullAlerts: (data: {}) => void;
  setFullJams: (data: {}) => void;
  setFullXAxis: (data: {}) => void;
}

export const DATA_CONTEXT_DEFAULT_VALUE: DataContext = {
  dateTimeFrom: '',
  dateTimeTo: '',
  previousDate: '',
  xAxisData: [],
  jamsData: [],
  alertData: [],
  levelData: [],
  speedData: [],
  lengthData: [],
  timeData: [],
  alertTypes: {},
  fullAlerts: [],
  fullJams: [],
  fullXAxis: [],

  setDateTimeFrom: () => {},
  setDateTimeTo: () => {},
  setPreviousDate: () => {},
  setXAxisData: () => {},
  setJamsData: () => {},
  setAlertData: () => {},
  setLevelData: () => {},
  setSpeedData: () => {},
  setLengthData: () => {},
  setTimeData: () => {},
  setAlertTypes: () => {},
  setFullAlerts: () => {},
  setFullJams: () => {},
  setFullXAxis: () => {},
};

export const dataContext = React.createContext<DataContext>(DATA_CONTEXT_DEFAULT_VALUE);
