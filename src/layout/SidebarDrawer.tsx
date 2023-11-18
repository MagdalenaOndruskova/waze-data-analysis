import React, { useContext, useEffect, useRef, useState } from 'react';

import '../styles/layout-styles.scss';
import { Button, DatePicker, Drawer, Input, Select, SelectProps, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import useAxios from '../utils/useAxios';
import { FILTER_DEFAULT_VALUE, filterContext, streetContext } from '../utils/contexts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { StreetFull } from '../types/StreetFull';
import { useTranslation } from 'react-i18next';
import { RangePickerProps } from 'antd/es/date-picker';
import { getOptionsFromStreet } from '../utils/util';
import { Streets } from '../types/baseTypes';
import locale from 'antd/es/date-picker/locale/cs_CZ';

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

const SidebarDrawer = ({ open, onCloseDrawer }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  var options: SelectProps['options'] = [];

  const [selected, setSelected] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().add(-7, 'd'));

  const [dateTo, setDateTo] = useState<Dayjs>(dayjs());
  const [timeFrom, setTimeFrom] = useState<Dayjs>(dayjs('06:00', 'HH:mm'));
  const [timeTo, setTimeTo] = useState<Dayjs>(dayjs());

  const inicialized = useRef<Boolean>(false);

  const { filter, setNewFilter } = useContext(filterContext);

  const { setNewStreetsInSelected, streetsInSelected, streetsInMap, setNewStreetsInMap } = useContext(streetContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [messageDate, messageDateContext] = message.useMessage();

  useEffect(() => {
    setSelected(streetsInSelected);
  }, [streetsInSelected]);

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
    setTimeFrom(dayjs('06:00', 'HH:mm'));
    // setTimeFrom(dayjs().format('HH:mm'));
    setTimeTo(dayjs());
    setNewFilter({
      fromDate: dateFrom.format('YYYY-MM-DD'),
      toDate: dateTo.format('YYYY-MM-DD'),
      fromTime: timeFrom.format('HH:mm'),
      toTime: timeTo.format('HH:mm'),
      streets: [],
    });

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
        content: t('errorMessage.WrongDateFromTo'),
        duration: 10,
        className: 'messageError',
        style: {
          marginTop: '40px',
        },
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

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Disable dates after today
    if (current && current > dayjs().endOf('day')) {
      return true;
    }
    // Disable dates older than 1 year from today
    if (current && current < dayjs().subtract(1, 'year').subtract(1, 'day')) {
      return true;
    }

    return false;
  };

  return (
    <Drawer className="sidebar-drawer" title="Basic Drawer" placement="left" onClose={onCloseDrawer} open={open}>
      {messageDateContext}
      <h2>{t('Filters')}</h2>
      <h3 className="text-left">{t('Time Range')}</h3>
      <p className="text-left">{t('From')}</p>
      <DatePicker
        name="DateFrom"
        locale={locale}
        className="filterStyle"
        disabledDate={disabledDate}
        allowClear={false}
        onChange={(value) => {
          setDateFrom(value);
        }}
        value={dayjs(dateFrom)}
      />
      <TimePicker
        className="filterStyle"
        locale={locale}
        onChange={(value) => setTimeFrom(value)}
        format="HH:mm"
        allowClear={false}
        value={dayjs(timeFrom, 'HH:mm')}
      />
      <p className="text-left">{t('To')}</p>
      <DatePicker
        className="filterStyle"
        locale={locale}
        onChange={(value) => setDateTo(value)}
        value={dayjs(dateTo)}
        allowClear={false}
        disabledDate={disabledDate}
      />
      <TimePicker
        className="filterStyle"
        locale={locale}
        onChange={(value) => setTimeTo(value)}
        value={dayjs(timeTo)}
        allowClear={false}
        format="HH:mm"
      />
      <h3 className="text-left">{t('Streets')}</h3>
      <Select
        className="filterStyle"
        mode="multiple"
        allowClear
        placeholder={t('PleaseSelect')}
        onChange={(value) => {
          setSelected(value);
          setNewStreetsInSelected(value);
        }}
        //  TODO: filter ignore diacritics
        value={selected}
        options={options}
      />
      <Button className="filterStyle" onClick={filterData}>
        {t('FILTER')}
      </Button>
      <Button className="filterStyle" onClick={clearFilters}>
        {t('RESET')}
      </Button>
    </Drawer>
  );
};

export default SidebarDrawer;
