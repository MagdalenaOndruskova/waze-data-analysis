import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Input, Select, SelectProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filterContext, routeContext, streetContext } from '../../utils/contexts';
import useAxios from '../../utils/useAxios';
import { Coord, Streets } from '../../types/baseTypes';
import { getOptionsFromStreet } from '../../utils/util';
import { deburr } from 'lodash';
import { deleteAllFromMap, deleteFromMap, deleteMultipleFromMap, drawOnMap } from '../../utils/map';
import { get_route, get_streets_coord } from '../../utils/backendApiRequests';
import { StreetInMap } from '../../types/StreetInMap';

type Props = {
  openDrawerRoute: boolean;
  setOpenDrawerRoute: React.Dispatch<React.SetStateAction<boolean>>;
  setRouteStreets: React.Dispatch<any>;
  map: L.Map;
};

const ignoreDiacriticsFilter = (input, option) => {
  // Normalize both input and option text to remove diacritics
  const inputValue = deburr(input).toLowerCase();
  const optionValue = deburr(option.value).toLowerCase();

  return optionValue.includes(inputValue);
};

const StreetsDrawer = ({ openDrawerRoute, setOpenDrawerRoute, setRouteStreets, map }: Props) => {
  const { t } = useTranslation();
  const {
    streetsInRoute,
    setNewStreetsInSelected,
    setNewStreetsInMap,
    setNewNewlySelected,
    streetsInSelected,
    streetsInMap,
    setNewStreetsInRoute,
  } = useContext(streetContext);
  const { filter, setNewFilter } = useContext(filterContext);
  const { coordinates, setNewRoute, setNewCoordinates } = useContext(routeContext);

  const [options, setOptions] = useState<SelectProps['options']>(getOptionsFromStreet(null, []));
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setNewStreetsInSelected(filter.streets);
    const filterStreets = [...filter.streets];
    console.log('🚀 ~ useEffect ~ filterStreets:', filterStreets);
    const fetchData = async (street_name) => {
      const isMatched = streetsInMap.some((street) => street.name === street_name);

      if (!isMatched) {
        const data = await get_streets_coord(filter, street_name);
        const newStreets = [];
        data?.streets?.forEach((element) => {
          const newDrawedStreet: StreetInMap = drawOnMap(map, element.street_name, element.path, element.color);
          newStreets.push(newDrawedStreet);
        });
        setNewStreetsInMap((prevState) => [...prevState, ...newStreets]);

        return data;
      }
    };

    if (filterStreets?.length > 1) {
      filterStreets?.slice(0, -1).forEach((street_name) => {
        // setNewNewlySelected(street_name);
        fetchData(street_name);
      });
    }
  }, [filter]);

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
    console.log(streetsInRoute);
    setOptions(getOptionsFromStreet(dataStreets, streetsInRoute));
    setSelected((prevValue) => {
      return prevValue.filter((street) => !streetsInRoute.includes(street));
    });
  }, [dataStreets, streetsInRoute]);

  useEffect(() => {
    const streets = streetsInMap.filter(
      (obj) => !streetsInSelected.includes(obj.name) && !streetsInRoute.includes(obj.name),
    );
    const names_unique = [...new Set(streets.map((obj) => obj.name))];

    if (names_unique.length > 0) {
      setNewStreetsInMap(deleteMultipleFromMap(streetsInMap, names_unique));
    }

    setNewNewlySelected(streetsInSelected?.slice(-1)[0]); //sending to drawing

    setSelected(streetsInSelected);
  }, [streetsInSelected]);

  async function updateRoute(index: number) {
    console.log(index);
    console.log(coordinates[index]);
    console.log('🚀 ~ StreetsDrawer ~ coordinates:', coordinates);

    const removedCoord: Coord = coordinates.splice(index, 1)[0];
    removedCoord.marker.remove();
    setNewCoordinates(coordinates);
    deleteAllFromMap(streetsInMap);

    console.log('🚀 ~ StreetsDrawer ~ coordinates:', coordinates);
    // call again the routing algorithmus for each point
    for (let i = 0; i < coordinates.length - 1; i++) {
      let pair = [coordinates[i], coordinates[i + 1]];
      console.log(pair);
      const response = await get_route(pair[0], pair[1], filter);

      setRouteStreets(response.streets_coord);
      setNewStreetsInRoute([...new Set([...response.streets_coord.map((street) => street.street_name)])]);

      setNewRoute((prevData) => {
        return [...prevData, ...response.route];
      });
    }
  }

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
      {coordinates?.length > 0 ? <h3>{t('route.pass')}</h3> : <></>}

      <div style={{ maxHeight: '410px', overflowY: 'scroll' }}>
        {coordinates?.map((coord, index) =>
          coord.street.length > 0 ? (
            <div key={index.toString()}>
              <Input style={{ width: '170px' }} value={coord.street} disabled />

              <CloseOutlined
                className="iconCancel"
                onClick={async () => {
                  await updateRoute(index);
                }}
              />
            </div>
          ) : (
            <></>
          ),
        )}
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
          setNewFilter((prevState) => ({
            ...prevState,
            streets: value,
          }));
        }}
        options={options}
        value={selected}
        filterOption={ignoreDiacriticsFilter}
      />
    </Drawer>
  );
};

export default StreetsDrawer;
