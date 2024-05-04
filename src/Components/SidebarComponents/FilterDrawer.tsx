import { DatePicker, Drawer, Select, SelectProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptionsFromStreet, ignoreDiacriticsFilter } from '../../utils/util';
import { filterContext, streetContext } from '../../utils/contexts';
import useAxios from '../../utils/useAxios';
import { Streets } from '../../types/baseTypes';
import locale from 'antd/es/date-picker/locale/cs_CZ';
import dayjs, { Dayjs } from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';

type Props = { openDrawerFilter: boolean; setOpenDrawerFilter: React.Dispatch<React.SetStateAction<boolean>> };

const FilterDrawer = ({ openDrawerFilter, setOpenDrawerFilter }: Props) => {
  const { t } = useTranslation();
  const { streetsInRoute, setNewStreetsInSelected, streetsInSelected } = useContext(streetContext);
  const { filter, setNewFilter } = useContext(filterContext);

  const [options, setOptions] = useState<SelectProps['options']>(getOptionsFromStreet(null, []));
  const [selected, setSelected] = useState<string[]>([]);

  const {
    response: dataStreets,
    loading: loadingStreets,
    error: errorStreets,
  } = useAxios<Streets>({
    url: 'query?where=1%3D1',
    api: 'street',
    getData: true,
  });

  useEffect(() => {
    if (!dataStreets) {
      return;
    }
    setOptions(getOptionsFromStreet(dataStreets, streetsInRoute));
    setSelected((prevValue) => {
      return prevValue.filter((street) => !streetsInRoute.includes(street));
    });
  }, [dataStreets, streetsInRoute]);

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
      title={t('FILTER')}
      placement="left"
      onClose={() => setOpenDrawerFilter(false)}
      open={openDrawerFilter}
      width={'250px'}
      closable={true}
      zIndex={10000}
    >
      <h3 className="text-left">{t('Time Range')}</h3>
      <p className="text-left">{t('From')}:</p>

      <DatePicker
        name="DateFrom"
        locale={locale}
        className="filterStyle"
        disabledDate={disabledDate}
        allowClear={false}
        onChange={(value) => {
          setNewFilter((prevState) => ({
            ...prevState,
            fromDate: value.format('YYYY-MM-DD'),
          }));
        }}
        value={dayjs(filter.fromDate)}
      />
      <h3 className="text-left">{t('To')}:</h3>

      <DatePicker
        className="filterStyle"
        locale={locale}
        onChange={(value) => {
          setNewFilter((prevState) => ({
            ...prevState,
            toDate: value.format('YYYY-MM-DD'),
          }));
        }}
        value={dayjs(filter.toDate)}
        allowClear={false}
        disabledDate={disabledDate}
      />

      <h3 className="text-left">{t('PleaseSelect')}:</h3>
      <Select
        showSearch
        className="filterStyle streets"
        allowClear
        mode="multiple"
        placeholder={t('PleaseSelect')}
        onChange={(value) => {
          setNewStreetsInSelected(value);
          setNewFilter((prevState) => ({
            ...prevState,
            streets: value,
          }));
        }}
        options={options}
        value={streetsInSelected}
        filterOption={ignoreDiacriticsFilter}
      />
    </Drawer>
  );
};

export default FilterDrawer;
