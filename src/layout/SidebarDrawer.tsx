import React, { useContext, useEffect, useRef, useState } from 'react';

import '../styles/layout-styles.scss';
import { Drawer, Input, Select, SelectProps, message } from 'antd';
import useAxios from '../utils/useAxios';
import { streetContext } from '../utils/contexts';
import { useTranslation } from 'react-i18next';
import { getOptionsFromStreet } from '../utils/util';
import { Streets } from '../types/baseTypes';
import { deleteMultipleFromMap } from '../utils/map';

type Props = {
  open: boolean;
  onCloseDrawer: any;
};

const SidebarDrawer = ({ open, onCloseDrawer }: Props) => {
  const { t } = useTranslation();

  var options: SelectProps['options'] = [];

  const [selected, setSelected] = useState<string[]>([]);

  const {
    setNewStreetsInSelected,
    streetsInSelected,
    streetsInMap,
    setNewStreetsInMap,
    newlySelected,
    setNewNewlySelected,
  } = useContext(streetContext);

  const [messageDate, messageDateContext] = message.useMessage();

  useEffect(() => {
    const streetsInMapStaying = deleteMultipleFromMap(streetsInMap, streetsInSelected); // deleting removed streets
    setNewStreetsInMap(streetsInMapStaying);

    const oldSelected = [...selected];
    const newSelected = streetsInSelected.filter((street) => !oldSelected.includes(street));
    setNewNewlySelected(newSelected[0]); //sending to drawing

    setSelected(streetsInSelected); // setting actual state
  }, [streetsInSelected]);

  // useEffect(() => {
  //   if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
  //     const { fromDate, toDate } = filter;
  //     setSearchParams({
  //       fromDate,
  //       toDate,
  //       streets: `('${filter.streets.join(`', '`)}')`,
  //     });
  //   } else {
  //     if (inicialized.current === true) {
  //       setSearchParams({});
  //     }
  //   }
  // }, [filter]);

  // useEffect(() => {
  //   if (inicialized.current === false) {
  //     if (filter === null && searchParams.toString() !== '') {
  //       const fromDate = searchParams.get('fromDate');
  //       const toDate = searchParams.get('toDate');
  //       var streets = searchParams.get('streets');

  //       // TODO: check when creating url params, so that when no street, dont have this url param
  //       var streetsSplitted = [];
  //       if (streets !== "('')") {
  //         streets = streets.replaceAll("'", '');
  //         streets = streets.replaceAll('(', '');
  //         streets = streets.replaceAll(')', '');
  //         streetsSplitted = streets.split(',');
  //         streetsSplitted = streetsSplitted.map((item) => item.trim());
  //       }
  //       setNewFilter({ fromDate, toDate, streets: streetsSplitted });
  //       setDateFrom(dayjs(fromDate));
  //       setDateTo(dayjs(toDate));
  //       setSelected(streetsSplitted);
  //       setNewStreetsInSelected(streetsSplitted);

  //       // TODO: while refresh, when loading filter from url it is called default filter in request
  //       inicialized.current = true;
  //     }
  //     if (searchParams.toString() === '') {
  //       setNewFilter(FILTER_DEFAULT_VALUE.filterDefaultValue);
  //     }
  //   }
  // }, [searchParams, inicialized]);

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
    </Drawer>
  );
};

export default SidebarDrawer;
