import React, { useContext, useEffect, useRef, useState } from 'react';
import '../styles/layout-styles.scss';
import { Button, DatePicker, Select, SelectProps, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import { Street } from '../types/Street';
import useAxios from '../utils/useAxios';
import { FILTER_DEFAULT_VALUE, filterContext, streetContext } from '../utils/contexts';
import { redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { StreetFull } from '../types/StreetFull';

type Streets = {
  features: {
    attributes: Street;
    geometry: {
      paths: [];
    };
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

function getStreetsLocations(streets: Streets | null) {
  var streetsFulls: StreetFull[] = [];
  streets?.features?.map(({ attributes, geometry }, index) =>
    streetsFulls.push({
      name: attributes.nazev,
      code: attributes.kod,
      location: geometry?.paths?.map((a: []) => a?.map((b) => [b[1], b[0]])),
    }),
  );
  return streetsFulls;
}

const Sidebar = () => {
  const navigate = useNavigate();

  var options: SelectProps['options'] = [];
  var streetFullLocation: StreetFull[] = [];

  const [selected, setSelected] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().add(-7, 'd'));
  const [dateTo, setDateTo] = useState<Dayjs>(dayjs());
  const [timeFrom, setTimeFrom] = useState<Dayjs>(dayjs('08:00', 'HH:mm'));
  const [timeTo, setTimeTo] = useState<Dayjs>(dayjs('08:00', 'HH:mm'));

  const inicialized = useRef<Boolean>(false);

  const {
    filter,
    setNewFilter,
    streetsFromMap,
    setNewStreetsFromMap,
    setNewStreetsFromMapSelected,
    streetsInMap,
    setNewStreetsInMap,
  } = useContext(filterContext);

  const { streetsWithLocation, streetsInSelected, setNewStreetsWithLocation, setNewStreetsInSelected } =
    useContext(streetContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [messageDate, messageDateContext] = message.useMessage();

  useEffect(() => {
    var possibleStreets = [];
    possibleStreets = options.map((item) => item.value);
    var streets = streetsFromMap.filter((item) => possibleStreets.includes(item));
    const street = streets[0];
    setSelected((prevState) => [...new Set([...prevState, street])]);
    setSelected((prevState) => prevState.filter((item) => item));
    setNewStreetsFromMapSelected(street);
  }, [streetsFromMap]);

  useEffect(() => {
    setNewStreetsInSelected(selected);
  }, [selected]);

  useEffect(() => {
    if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
      const { fromDate, fromTime, toDate, toTime } = filter;
      setSearchParams({
        fromDate,
        fromTime,
        toDate,
        toTime,
        streets: `('${filter.streets.join(`', '`)}')`,
      });
    } else {
      if (inicialized.current === true) {
        setSearchParams({});
      }
    }
  }, [filter]);

  useEffect(() => {
    if (inicialized.current === false) {
      if (filter === null && searchParams.toString() !== '') {
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
          streetsSplitted = streetsSplitted.map((item) => item.trim());
        }
        setNewFilter({ fromDate, fromTime, toDate, toTime, streets: streetsSplitted });
        setDateFrom(dayjs(fromDate));
        setTimeFrom(dayjs(fromTime, 'HH:mm'));
        setDateTo(dayjs(toDate));
        setTimeTo(dayjs(toTime, 'HH:mm'));
        setSelected(streetsSplitted);
        setNewStreetsInSelected(streetsSplitted);

        // TODO: while refresh, when loading filter from url it is called default filter in request
        inicialized.current = true;
      }
      if (searchParams.toString() === '') {
        setNewFilter(FILTER_DEFAULT_VALUE.filterDefaultValue);
      }
    }
  }, [searchParams, inicialized]);

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
    streetsInMap.forEach((street) => {
      street.lines.forEach((line) => {
        line.remove();
      });
    });
    setNewStreetsInSelected([]);
    setNewStreetsInMap([]);
    navigate('/waze-data-analysis/');
  };

  const filterData = () => {
    if (dateTo.isBefore(dateFrom)) {
      messageDate.open({
        type: 'error',
        // style: {
        //   marginTop: '5vh',
        // },
        content: 'Please select date in format FROM-TO, TO can not be before FROM.',
        duration: 10,
      });

      return;
    }

    setNewFilter({
      fromDate: dateFrom.format('YYYY-MM-DD'),
      toDate: dateTo.format('YYYY-MM-DD'),
      fromTime: timeFrom.format('HH:mm'),
      toTime: timeTo.format('HH:mm'),
      streets: selected,
    });
  };

  const {
    response: dataStreets,
    loading: loadingStreets,
    error: errorStreets,
  } = useAxios<Streets>({
    url: 'query?where=1%3D1',
    api: 'street',
    getData: true,
  });

  options = getOptionsFromStreet(dataStreets);

  useEffect(() => {
    streetFullLocation = getStreetsLocations(dataStreets);
    setNewStreetsWithLocation(streetFullLocation);
  }, [dataStreets]);

  return (
    <div className="sidebar">
      {messageDateContext}
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
