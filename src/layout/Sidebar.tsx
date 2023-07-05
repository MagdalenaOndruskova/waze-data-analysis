import React, { useContext, useEffect, useState } from 'react';
import '../styles/layout-styles.scss';
import { Button, DatePicker, DatePickerProps, Form, Select, SelectProps, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Street } from '../types/Street';
import useAxios from '../utils/useAxios';
import { filterContext } from '../utils/contexts';

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
  const [selected, setSelected] = useState([]);
  const [dateFrom, setDateFrom] = useState(dayjs().add(-7, 'd'));
  const [dateTo, setDateTo] = useState(dayjs());
  const [timeFrom, setTimeFrom] = useState(dayjs('08:00', 'HH:mm'));
  const [timeTo, setTimeTo] = useState(dayjs('08:00', 'HH:mm'));
  const { filter, setNewFilter, streetsFromMap } = useContext(filterContext);

  useEffect(() => {
    setSelected((prevState) => [...new Set([...prevState, ...streetsFromMap])]);
  }, [streetsFromMap]);

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
    url: '/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
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
        defaultValue={dayjs().add(-7, 'd')}
        value={dateFrom}
      />
      <TimePicker
        className="filterStyle"
        onChange={(value) => setTimeFrom(value)}
        defaultOpenValue={dayjs('08:00', 'HH:mm')}
        format="HH:mm"
        defaultValue={dayjs('08:00', 'HH:mm')}
        value={timeFrom}
      />
      <p>To:</p>
      <DatePicker
        className="filterStyle"
        onChange={(value) => setDateTo(value)}
        defaultValue={dayjs()}
        value={dateTo}
      />
      <TimePicker
        className="filterStyle"
        onChange={(value) => setTimeTo(value)}
        value={timeTo}
        defaultOpenValue={dayjs('08:00', 'HH:mm')}
        format="HH:mm"
        defaultValue={dayjs('08:00', 'HH:mm')}
      />
      <h3>Streets:</h3>
      <Select
        className="filterStyle"
        mode="multiple"
        allowClear
        placeholder="Please select"
        // onChange={(value) => setSelected(value)}
        onChange={(value) => {
          console.log('value', value);
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
