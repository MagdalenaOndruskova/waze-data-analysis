import React, { useContext, useEffect, useRef, useState } from 'react';

import '../styles/layout-styles.scss';
import { Button, DatePicker, Drawer, Input, Select, SelectProps, message } from 'antd';
import dayjs from 'dayjs';
import useAxios from '../utils/useAxios';
import { FILTER_DEFAULT_VALUE, filterContext, streetContext } from '../utils/contexts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { RangePickerProps } from 'antd/es/date-picker';
import { getOptionsFromStreet } from '../utils/util';
import { Streets } from '../types/baseTypes';
import locale from 'antd/es/date-picker/locale/cs_CZ';
import { deleteMultipleFromMap } from '../utils/map';

type Props = {
  open: boolean;
  onCloseDrawer: any;
};

const SidebarDrawer = ({ open, onCloseDrawer }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  var options: SelectProps['options'] = [];

  const [selected, setSelected] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().add(-7, 'd'));

  const [dateTo, setDateTo] = useState<Dayjs>(dayjs());

  const inicialized = useRef<Boolean>(false);

  const { filter, setNewFilter } = useContext(filterContext);

  const {
    setNewStreetsInSelected,
    streetsInSelected,
    streetsInMap,
    setNewStreetsInMap,
    newlySelected,
    setNewNewlySelected,
  } = useContext(streetContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [messageDate, messageDateContext] = message.useMessage();

  useEffect(() => {
    const streetsInMapStaying = deleteMultipleFromMap(streetsInMap, streetsInSelected); // deleting removed streets
    setNewStreetsInMap(streetsInMapStaying);

    const oldSelected = [...selected];
    const newSelected = streetsInSelected.filter((street) => !oldSelected.includes(street));
    setNewNewlySelected(newSelected[0]); //sending to drawing

    setSelected(streetsInSelected); // setting actual state
  }, [streetsInSelected]);

  useEffect(() => {
    if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
      const { fromDate, toDate } = filter;
      setSearchParams({
        fromDate,
        toDate,
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
        const toDate = searchParams.get('toDate');
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
        setNewFilter({ fromDate, toDate, streets: streetsSplitted });
        setDateFrom(dayjs(fromDate));
        setDateTo(dayjs(toDate));
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
    setNewFilter({
      fromDate: dateFrom.format('YYYY-MM-DD'),
      toDate: dateTo.format('YYYY-MM-DD'),
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
    <Drawer
      className="sidebar-drawer"
      title={t('Filters')}
      placement="left"
      onClose={onCloseDrawer}
      open={open}
      closable={true}
      width={'200px'}
      zIndex={10000}
    >
      {messageDateContext}
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

      <p className="text-left">{t('To')}</p>
      <DatePicker
        className="filterStyle"
        locale={locale}
        onChange={(value) => setDateTo(value)}
        value={dayjs(dateTo)}
        allowClear={false}
        disabledDate={disabledDate}
      />

      <h3 className="text-left">{t('Streets')}</h3>
      <Select
        className="filterStyle"
        mode="multiple"
        allowClear
        placeholder={t('PleaseSelect')}
        onChange={(value) => {
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
