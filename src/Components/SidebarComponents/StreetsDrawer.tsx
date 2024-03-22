import { CloseOutlined } from '@ant-design/icons';
import { Card, Drawer, Select, SelectProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { streetContext } from '../../utils/contexts';
import useAxios from '../../utils/useAxios';
import { Streets } from '../../types/baseTypes';
import { getOptionsFromStreet } from '../../utils/util';
import { deburr } from 'lodash';

type Props = {
  openDrawerRoute: boolean;
  setOpenDrawerRoute: React.Dispatch<React.SetStateAction<boolean>>;
  routeStreets: any;
};

const ignoreDiacriticsFilter = (input, option) => {
  // Normalize both input and option text to remove diacritics
  const inputValue = deburr(input).toLowerCase();
  const optionValue = deburr(option.value).toLowerCase();

  return optionValue.includes(inputValue);
};

const StreetsDrawer = ({ openDrawerRoute, setOpenDrawerRoute, routeStreets }: Props) => {
  const { t } = useTranslation();
  const {
    streetsInRoute,
    setNewStreetsInSelected,
    setNewStreetsInMap,
    setNewNewlySelected,
    streetsInSelected,
    streetsInMap,
  } = useContext(streetContext);
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

  //   options = getOptionsFromStreet(dataStreets);

  useEffect(() => {
    if (!dataStreets) {
      return;
    }
    console.log(streetsInRoute);
    setOptions(getOptionsFromStreet(dataStreets, streetsInRoute));
    const toDelete = selected.filter((street) => streetsInRoute.includes(street));
    // todo: odstran tie ktore si zobrala zo select aj z vykreslovaneho pola
    // neodstrani to uz vykreslenu trasu?
    setSelected((prevValue) => {
      return prevValue.filter((street) => !streetsInRoute.includes(street));
    });
  }, [dataStreets, streetsInRoute]);

  useEffect(() => {
    setNewNewlySelected(streetsInSelected?.slice(-1)[0]); //sending to drawing

    setSelected(streetsInSelected);
  }, [streetsInSelected]);

  return (
    <Drawer
      className="sidebar-drawer"
      title={t('sidebar.route')}
      placement="left"
      onClose={() => setOpenDrawerRoute(false)}
      open={openDrawerRoute}
      width={'250px'}
      closable={true}
      zIndex={10000}
    >
      {streetsInRoute?.length > 0 ? <h3>{t('route.pass')}</h3> : <></>}

      <div style={{ maxHeight: '410px', overflowY: 'scroll' }}>
        {streetsInRoute?.map((street, index) => (
          <div key={index.toString()}>
            {/* {index === 0 && <h3>{t('route.pass')}</h3>} */}
            <Select
              showSearch
              className="filterStyle"
              allowClear
              placeholder={t('PleaseSelect')}
              onChange={(value) => {}} // todo change value in route
              value={street}
              options={options}
            />

            <CloseOutlined className="iconCancel" onClick={() => {}} />
          </div>
        ))}
      </div>

      <h3>{t('sidebar.streets.more')}:</h3>
      <Select
        showSearch
        className="filterStyle"
        allowClear
        mode="multiple"
        placeholder={t('PleaseSelect')}
        onChange={(value) => {
          setNewStreetsInSelected(value);
        }}
        options={options}
        value={selected}
        filterOption={ignoreDiacriticsFilter}
      />
    </Drawer>
  );
};

export default StreetsDrawer;
