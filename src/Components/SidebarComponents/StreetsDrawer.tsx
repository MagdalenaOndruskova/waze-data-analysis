import { CloseOutlined } from '@ant-design/icons';
import { Drawer, Select, SelectProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { streetContext } from '../../utils/contexts';
import useAxios from '../../utils/useAxios';
import { Streets } from '../../types/baseTypes';
import { getOptionsFromStreet } from '../../utils/util';
import { deleteMultipleFromMap } from '../../utils/map';

type Props = {
  openDrawerRoute: boolean;
  setOpenDrawerRoute: React.Dispatch<React.SetStateAction<boolean>>;
  routeStreets: any;
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
    setOptions(getOptionsFromStreet(dataStreets, streetsInRoute));
    const toDelete = selected.filter((street) => streetsInRoute.includes(street));
    // todo: odstran tie ktore si zobrala zo select aj z vykreslovaneho pola
    // neodstrani to uz vykreslenu trasu?
    setSelected((prevValue) => {
      return prevValue.filter((street) => !streetsInRoute.includes(street));
    });
  }, [dataStreets, streetsInRoute]);

  useEffect(() => {
    setNewNewlySelected(streetsInSelected.slice(-1)[0]); //sending to drawing

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
      {streetsInRoute?.map((street, index) => (
        <div key={index.toString()}>
          {index === 0 && <p>{t('route.pass')}:</p>}
          <Select
            showSearch
            className="filterStyle"
            allowClear
            placeholder={t('PleaseSelect')}
            onChange={(value) => {}}
            value={street}
            options={options}
          />

          <CloseOutlined className="iconCancel" onClick={() => {}} />
        </div>
      ))}

      <h3>{t('sidebar.streets.more')}</h3>
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
      />
    </Drawer>
  );
};

export default StreetsDrawer;
