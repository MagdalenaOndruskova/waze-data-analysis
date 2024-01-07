import React from 'react';
import { DATA_CONTEXT_DEFAULT_VALUE, DataContext } from './contexts';

export const useDataContext = (): DataContext => {
  const [dateTimeFrom, setNewDateTimeFrom] = React.useState<string>(DATA_CONTEXT_DEFAULT_VALUE.dateTimeFrom);
  const [dateTimeTo, setNewDateTimeTo] = React.useState<string>(DATA_CONTEXT_DEFAULT_VALUE.dateTimeTo);
  const [xAxisData, setNewXAxisData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.xAxisData);
  const [jamsData, setNewJamsData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.jamsData);
  const [alertData, setNewAlertData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.alertData);
  const [levelData, setNewLevelData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.levelData);
  const [speedData, setNewSpeedData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.speedData);
  const [lengthData, setNewLengthData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.lengthData);
  const [timeData, setNewTimeData] = React.useState<[]>(DATA_CONTEXT_DEFAULT_VALUE.timeData);
  const [previousDate, setNewPreviousDate] = React.useState<string>(DATA_CONTEXT_DEFAULT_VALUE.previousDate);
  const [alertTypes, setNewAlertTypes] = React.useState<{}>(DATA_CONTEXT_DEFAULT_VALUE.alertTypes);

  const setDateTimeFrom = React.useCallback((dateTime: string): void => {
    setNewDateTimeFrom(dateTime);
  }, []);

  const setDateTimeTo = React.useCallback((dateTime: string): void => {
    setNewDateTimeTo(dateTime);
  }, []);

  const setXAxisData = React.useCallback((xAxisData: []): void => {
    setNewXAxisData(xAxisData);
  }, []);

  const setJamsData = React.useCallback((data: []): void => {
    setNewJamsData(data);
  }, []);

  const setAlertData = React.useCallback((data: []): void => {
    setNewAlertData(data);
  }, []);

  const setLevelData = React.useCallback((data: []): void => {
    setNewLevelData(data);
  }, []);

  const setSpeedData = React.useCallback((data: []): void => {
    setNewSpeedData(data);
  }, []);

  const setLengthData = React.useCallback((data: []): void => {
    setNewLengthData(data);
  }, []);

  const setTimeData = React.useCallback((data: []): void => {
    setNewTimeData(data);
  }, []);

  const setPreviousDate = React.useCallback((date: string): void => {
    setNewPreviousDate(date);
  }, []);

  const setAlertTypes = React.useCallback((data: {}): void => {
    setNewAlertTypes(data);
  }, []);

  return {
    dateTimeFrom,
    dateTimeTo,
    previousDate,
    xAxisData,
    jamsData,
    alertData,
    levelData,
    speedData,
    lengthData,
    timeData,
    alertTypes,

    setDateTimeFrom,
    setDateTimeTo,
    setPreviousDate,
    setXAxisData,
    setJamsData,
    setAlertData,
    setLevelData,
    setSpeedData,
    setLengthData,
    setTimeData,
    setAlertTypes,
  };
};
