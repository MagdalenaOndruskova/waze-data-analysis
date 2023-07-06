import React, { useContext, useEffect, useRef, useState } from 'react';
import '../styles/layout-styles.scss';
import { Button, DatePicker, DatePickerProps, Form, Select, SelectProps, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Street } from '../types/Street';
import useAxios from '../utils/useAxios';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';
import { json, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';

type Streets = {
  features: {
    attributes: Street;
  }[];
};

function getOptionsFromStreet(streets: Streets | null) {
  const options: SelectProps['options'] = [];
  // mapping streets to Select options
  streets?.features?.map(({ attributes }, index) =>
    options.push({
      label: attributes.nazev,
      value: attributes.nazev,
    }),
  );
  // sorting values
  options.sort((val1, val2) => val1?.value?.toString().localeCompare(val2?.value.toString()));

  return options;
}

const Sidebar = () => {
  var options: SelectProps['options'] = [];

  const [selected, setSelected] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().add(-7, 'd'));
  const [dateTo, setDateTo] = useState<Dayjs>(dayjs());
  const [timeFrom, setTimeFrom] = useState<Dayjs>(dayjs('08:00', 'HH:mm'));
  const [timeTo, setTimeTo] = useState<Dayjs>(dayjs('08:00', 'HH:mm'));

  const inicialized = useRef<Boolean>(false);

  const { filter, setNewFilter, streetsFromMap, setNewStreetsFromMap } = useContext(filterContext);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    var possibleStreets = [];
    possibleStreets = options.map((item) => item.value);
    var streets = streetsFromMap.filter((item) => possibleStreets.includes(item));
    const street = streets[0];
    setSelected((prevState) => [...new Set([...prevState, street])]);
    setSelected((prevState) => prevState.filter((item) => item));
  }, [streetsFromMap]);

  // TODO: useRef
  useEffect(() => {
    // if (inicialized.current === false) {
    if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filter)) {
      const { fromDate, fromTime, toDate, toTime } = filter;
      setSearchParams({
        fromDate,
        fromTime,
        toDate,
        toTime,
        streets: `('${filter.streets.join(`', '`)}')`,
      });
      // inicialized.current = true;
    } else {
      if (inicialized.current === true) {
        setSearchParams({});
      }
      // inicialized.current = true;
    }
    // }
  }, [filter]);

  useEffect(() => {
    if (inicialized.current === false) {
      if (JSON.stringify(filter) === JSON.stringify(FILTER_DEFAULT_VALUE.filter) && searchParams.toString() !== '') {
        const fromDate = searchParams.get('fromDate');
        const fromTime = searchParams.get('fromTime');
        const toDate = searchParams.get('toDate');
        const toTime = searchParams.get('toTime');
        var streets = searchParams.get('streets');

        // TODO: check when creating url params, so that when no street, dont have this url param
        var streetsSplitted = [];
        if (streets !== "('')") {
          streets = streets.replaceAll("'", '');
          streets = streets.replaceAll('(', '');
          streets = streets.replaceAll(')', '');
          streetsSplitted = streets.split(',');
        }

        setDateFrom(dayjs(fromDate));
        setTimeFrom(dayjs(fromTime, 'HH:mm'));
        setDateTo(dayjs(toDate));
        setTimeTo(dayjs(toTime, 'HH:mm'));
        setSelected(streetsSplitted);

        streetsSplitted = streetsSplitted.map((item) => item.trim());

        setNewFilter({ fromDate, fromTime, toDate, toTime, streets: streetsSplitted });

        // TODO: while refresh, when loading filter from url it is called default request
        inicialized.current = true;
      }
      console.log('🚀 ~ file: Sidebar.tsx:104 ~ useEffect ~ streetsSplitted:', streetsSplitted);
    }
  }, [searchParams, inicialized]);
  console.log(filter);
  const clearFilters = () => {
    setSelected([]);
    setDateFrom(dayjs().add(-7, 'd'));
    setDateTo(dayjs());

    //TODO: funguje iba aj ked sa date zmeni?
    setTimeFrom(dayjs('08:00', 'HH:mm'));
    setTimeTo(dayjs('08:00', 'HH:mm'));
    setNewFilter({
      fromDate: dateFrom.format('YYYY-MM-DD'),
      toDate: dateTo.format('YYYY-MM-DD'),
      fromTime: timeFrom.format('HH:mm'),
      toTime: timeTo.format('HH:mm'),
      streets: selected,
    });
    setNewStreetsFromMap([]);
  };

  const filterData = () => {
    setNewFilter({
      fromDate: dateFrom.format('YYYY-MM-DD'),
      toDate: dateTo.format('YYYY-MM-DD'),
      fromTime: timeFrom.format('HH:mm'),
      toTime: timeTo.format('HH:mm'),
      streets: selected,
    });
  };

  // TODO: pri setovani to, overit ze datum je po from

  const {
    response: dataStreets,
    loading: loadingStreets,
    error: errorStreets,
  } = useAxios<Streets>({
    url: 'query?where=1%3D1',
    api: 'street',
  });

  options = getOptionsFromStreet(dataStreets);

  return (
    <div className="sidebar">
      <h2>Filters</h2>
      <h3>Time range</h3>
      <p>From:</p>
      <DatePicker
        name="DateFrom"
        className="filterStyle"
        onChange={(value) => setDateFrom(value)}
        value={dayjs(dateFrom)}
      />
      <TimePicker
        className="filterStyle"
        onChange={(value) => setTimeFrom(value)}
        format="HH:mm"
        defaultValue={dayjs('08:00', 'HH:mm')}
        value={dayjs(timeFrom, 'HH:mm')}
      />
      <p>To:</p>
      <DatePicker className="filterStyle" onChange={(value) => setDateTo(value)} value={dayjs(dateTo)} />
      <TimePicker className="filterStyle" onChange={(value) => setTimeTo(value)} value={dayjs(timeTo)} format="HH:mm" />
      <h3>Streets:</h3>
      <Select
        className="filterStyle"
        mode="multiple"
        allowClear
        placeholder="Please select"
        onChange={(value) => {
          setSelected(value);
        }}
        value={selected}
        options={options}
      />
      <Button className="filterStyle" onClick={filterData}>
        FILTER
      </Button>
      <Button className="filterStyle" onClick={clearFilters}>
        RESET
      </Button>
    </div>
  );
};

export default Sidebar;
