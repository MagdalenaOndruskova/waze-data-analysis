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
    fromTime: dayjs('06:00', 'HH:mm').format('HH:mm'),
    toTime: dayjs().format('HH:mm'),
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
}

export const STREET_CONTEXT_DEFAULT_VALUE: StreetContext = {
  streetsInMap: [],
  streetsInSelected: [],
  newlySelected: '',
  setNewStreetsInMap: () => {},
  setNewStreetsInSelected: () => {},
  setNewNewlySelected: () => {},
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
};

export const dataContext = React.createContext<DataContext>(DATA_CONTEXT_DEFAULT_VALUE);
