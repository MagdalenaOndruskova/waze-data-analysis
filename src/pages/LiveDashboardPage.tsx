import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Select, SelectProps, Spin, message } from 'antd';
import { TrafficDelay } from '../types/TrafficDelay';
import { TrafficEvent } from '../types/TrafficEvent';
import useAxios from '../utils/useAxios';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LiveTile from '../Components/LiveTile';
import * as Icons from '../utils/icons';
import '../styles/main.scss';
import LineChart from '../Components/LineChart';
import { prepareData, prepareDataArray } from '../utils/prepareData';
import { filterContext, streetContext } from '../utils/contexts';
import { queryBuilder } from '../utils/queryBuilder';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { StreetInMap } from '../types/StreetInMap';
import { StreetFull } from '../types/StreetFull';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Street, StreetDelayCount } from '../types/Street';
import { CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { element } from 'prop-types';

type DataDelay = {
  features: {
    attributes: TrafficDelay;
  }[];
};

type DataEvent = {
  features: {
    attributes: TrafficEvent;
  }[];
};

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

function findArrayElementByName(array, name) {
  return array?.find((element) => {
    return element?.name === name;
  });
}

const LiveDashboardPage = () => {
  const { filter } = useContext(filterContext);
  const { t } = useTranslation();

  const { streetsWithLocation, streetsInSelected, setNewStreetsInSelected, streetsInMap, setNewStreetsInMap } =
    useContext(streetContext);

  const [open, setOpen] = useState(false);
  var options: SelectProps['options'] = [];

  const [sourceStreet, setSourceStreet] = useState<string>('');
  const [dstStreet, setDstStreet] = useState<string>('');
  const [passStreets, setPassStreets] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [statusFromStreet, setStatusFromStreet] = useState<'' | 'warning' | 'error'>('error');
  const [statusToStreet, setStatusToStreet] = useState<'' | 'warning' | 'error'>('error');
  const [streetDelayCount, setStreetDelayCount] = useState<StreetDelayCount[]>([]);
  const [routeStreets, setRouteStreets] = useState<any>([]);

  const mapRef = useRef<LeafletMap>(null);

  const query = queryBuilder(filter);

  const {
    response: dataDelay,
    loading: loadingDelay,
    error: errorDelay,
  } = useAxios<DataDelay>({
    url: `query?where=(${query})`,
    api: 'jam',
    getData: filter !== null,
  });

  const {
    response: dataEvent,
    loading: loadingEvent,
    error: errorEvent,
  } = useAxios<DataEvent>({
    url: `query?where=(${query})`,
    api: 'event',
    getData: filter !== null,
  });

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
    var delayCount: StreetDelayCount[] = [];
    if (dataStreets) {
      dataStreets?.features?.forEach((street) => {
        const count = dataDelay?.features?.reduce(
          (acc, cur) => (cur.attributes.street === street.attributes.nazev ? ++acc : acc),
          0,
        );
        delayCount.push({ name: street.attributes.nazev, count: count });
      });
      setStreetDelayCount(delayCount);
    }
  }, [dataDelay]);

  // getting street name from click on map
  const LocationFinderDummy = () => {
    const map = mapRef.current;

    useMapEvents({
      click: async (e) => {
        axios
          .get(`http://127.0.0.1:8000/reverse_geocode/street/?longitude=${e.latlng.lng}&latitude=${e.latlng.lat}`)
          .then((response) => {
            const name = response.data.street;
            const path = response.data.path;
            const streetInSelected = streetsInSelected.filter((label) => label === name);
            if (streetInSelected.length > 0) {
              // the street (part of it?) might be drawn -> remove it all
              const streetsInMapToDelete = streetsInMap.filter((street) => street.name === name);
              streetsInMapToDelete?.forEach((street) => {
                street?.lines?.forEach((line) => line.remove());
                console.log('mazem');
              });
              var newStreetsInMap = streetsInMap.filter((street) => street.name !== name); // keeping everything but the one i deleted
              setNewStreetsInMap(newStreetsInMap);
            }
            var streetInMapNew: StreetInMap = { name: name, lines: [] };
            path?.forEach((path: L.LatLngExpression[] | L.LatLngExpression[][]) => {
              console.log('kreslim sem');
              const line = L.polyline(path, { color: 'green' }).addTo(map);
              streetInMapNew.lines.push(line);
            });
            setNewStreetsInMap([...streetsInMap, streetInMapNew]);
            // add street to selected
            setNewStreetsInSelected([...new Set([...streetsInSelected, name])]);
          });
      },
    });

    return null;
  };

  useEffect(() => {
    const map = mapRef.current;
    let newStreetsInMap = streetsInMap;
    // drawing/removing streets in selected
    streetsInSelected?.forEach((element) => {
      const streetInSelected: StreetFull = streetsWithLocation?.find((item) => item?.name === element);

      if (!findArrayElementByName(newStreetsInMap, streetInSelected?.name)) {
        var newStreet: StreetInMap = { name: streetInSelected?.name, lines: [] };
        streetInSelected?.location?.forEach((path: L.LatLngExpression[] | L.LatLngExpression[][]) => {
          console.log('kreslim');
          const line = L.polyline(path, { color: 'green' }).addTo(map);
          newStreet.lines.push(line);
        });
        console.log(streetInSelected);
        newStreetsInMap.push(newStreet);
      }
    });
    const streetsInMapToDelete = newStreetsInMap?.filter((street) => !streetsInSelected.includes(street.name));
    const streetsInMapStaying = newStreetsInMap?.filter((street) => streetsInSelected.includes(street.name));
    streetsInMapToDelete?.forEach((street) => {
      street?.lines?.forEach((line) => line.remove());
    });
    setNewStreetsInMap(streetsInMapStaying);
  }, [streetsInSelected]);

  // draw streets in map based on selection (before clicking on filter button)
  // useEffect(() => {
  //   if (streetsWithLocation.length < 1 && streetsInSelected.length < 1) {
  //     // Need both defined - data and also selected streets
  //     return;
  //   }
  //   const map = mapRef.current;

  //   var streetsInMapNew: StreetInMap[] = [];

  //   streetsInSelected?.forEach((street: string) => {
  //     const streetInSelected: StreetFull = streetsWithLocation?.find((item) => item?.name === street);
  //     if (findArrayElementByName(streetsInMap, streetInSelected?.name)) {
  //       // checks if street is already drawn
  //       return;
  //     } else {
  //       // street not already drawn, so it should be drawn
  //       var newStreet: StreetInMap = { name: streetInSelected?.name, lines: [] };
  //       streetInSelected?.location?.forEach((path: L.LatLngExpression[] | L.LatLngExpression[][]) => {
  //         // const streetCount = streetDelayCount.filter((street) => street.name === streetInSelected.name)[0].count;
  //         var color = 'green';
  //         // if (streetCount <= 15) {
  //         //   color = 'green';
  //         // } else if (streetCount > 15 && streetCount <= 40) {
  //         //   color = 'orange';
  //         // } else {
  //         //   color = 'red';
  //         // }
  //         const line = L.polyline(path, { color: color }).addTo(map);
  //         newStreet.lines.push(line);
  //       });

  //       streetsInMapNew.push(newStreet);
  //     }
  //   });
  //   const streetsSmth = [...new Set([...streetsInMap, ...streetsInMapNew])];
  //   const streetsInMapStaying = streetsSmth?.filter((street) => streetsInSelected.includes(street.name));
  //   const streetsInMapToDelete = streetsSmth?.filter((street) => !streetsInSelected.includes(street.name));
  //   streetsInMapToDelete?.forEach((street) => {
  //     street?.lines?.forEach((line) => line.remove());
  //   });

  //   setNewStreetsInMap(streetsInMapStaying);
  // }, [streetsInSelected, streetsWithLocation]);

  const showModal = () => {
    setOpen(true);
  };

  const find_route = () => {
    const data_search = {
      src_street: sourceStreet,
      dst_street: dstStreet,
      src_coord: [16.7668, 45.76886],
      dst_coord: null,
      pass_streets: [...new Set(passStreets)],
    };
    axios
      .post(`http://127.0.0.1:8000/find_route/`, data_search)
      .then((response) => {
        setRouteStreets(response.data.streets_coord);
        setOpen(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data['detail']); // => the response payload
          messageApi.open({
            type: 'error',
            content: t('route.notfound'),
          });
        }
      });
  };

  useEffect(() => {
    const map = mapRef.current;
    var newStreetsInMap: StreetInMap[] = [];
    var newSelected: string[] = streetsInSelected;
    routeStreets?.forEach((element) => {
      // todo elemenet uz je vykresleny - remove z streets In map aj zo selected
      newSelected = newSelected.filter((selected) => selected !== element.street_name);
      newStreetsInMap = newStreetsInMap.filter((street) => street.name !== element.street_name);
      var streetInMapNew: StreetInMap = { name: element.street_name, lines: [] };
      element?.path?.forEach((coord: L.LatLngExpression[] | L.LatLngExpression[][]) => {
        console.log('kreslim tu');
        const line = L.polyline(coord, { color: 'red' }).addTo(map);
        streetInMapNew.lines.push(line);
      });
      newStreetsInMap.push(streetInMapNew);
      newSelected.push(element.street_name);
    });
    setNewStreetsInMap(newStreetsInMap);
    setNewStreetsInSelected(newSelected);
  }, [routeStreets]);

  const handleOk = () => {
    if (!sourceStreet) {
      setStatusFromStreet('error');
      messageApi.open({
        type: 'error',
        content: t('route.source.missing'),
      });
    } else {
      setStatusFromStreet('');
    }
    if (!dstStreet) {
      setStatusToStreet('error');
      messageApi.open({
        type: 'error',
        content: t('route.dst.missing'),
      });
    } else {
      setStatusToStreet('');
    }
    if (sourceStreet && dstStreet) {
      find_route();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const addPassStreet = () => {
    setPassStreets((prevState) => [...prevState, '']);
  };

  options = getOptionsFromStreet(dataStreets);
  // const visualRange = { startValue: filter.fromDate, endValue: filter.toDate };
  // console.log(prepareData(dataDelay, dataEvent, t));
  return (
    <Row>
      <Col span={20}>
        <Spin size="large" spinning={loadingDelay || loadingEvent}>
          <MapContainer ref={mapRef} center={[49.2, 16.6]} zoom={14} scrollWheelZoom={true} style={{ height: 580 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationFinderDummy />
          </MapContainer>
        </Spin>
        <div style={{ height: 50 }} className="modalButtonOpen">
          <Button className="filterStyle" onClick={showModal}>
            {t('route.button')}
          </Button>
        </div>
        <div style={{ height: 350 }}>
          {contextHolder}
          <Modal
            width={350}
            title={t('route.button')}
            open={open}
            onCancel={() => setOpen(false)}
            footer={[
              <div key={'top'} className="buttonsModal">
                <Button key="Pass" className="modalButton" onClick={addPassStreet}>
                  {t('route.pass')}
                </Button>

                <div key={'right'} className="rightButtons">
                  <Button key="Cancel" className="modalButton" onClick={handleCancel}>
                    {t('cancel')}
                  </Button>
                  <Button key="Ok" className="modalButtonOk" onClick={handleOk}>
                    OK
                  </Button>
                </div>
              </div>,
            ]}
          >
            <p>{t('route.source')}:</p>
            <Select
              showSearch
              key={'FromStreet'}
              status={statusFromStreet}
              className="modalStyle"
              allowClear
              placeholder={t('PleaseSelect')}
              onChange={(value) => {
                setSourceStreet(value);
                setStatusFromStreet('');
              }}
              //  TODO: filter ignore diacritics
              value={sourceStreet}
              options={options}
            />
            {passStreets.map((street, index) => (
              <div key={index.toString()}>
                {index === 0 && <p>{t('route.pass')}:</p>}
                <Select
                  showSearch
                  className="modalStylePass"
                  allowClear
                  placeholder={t('PleaseSelect')}
                  onChange={(value) => {
                    setPassStreets((prevState) => {
                      const stateCopy = [...prevState];
                      stateCopy[index] = value;
                      return stateCopy;
                    });
                  }}
                  //  TODO: filter ignore diacritics
                  value={street}
                  options={options}
                />

                <CloseOutlined
                  className="iconCancel"
                  onClick={() => {
                    setPassStreets((prevState) => {
                      const stateCopy = [...prevState];
                      stateCopy.splice(index, 1);
                      return stateCopy;
                    });
                  }}
                />
              </div>
            ))}

            <br></br>
            <p>{t('route.dst')}:</p>
            <Select
              showSearch
              key={'endStreet'}
              status={statusToStreet}
              className="modalStyle"
              allowClear
              placeholder={t('PleaseSelect')}
              onChange={(value) => {
                setDstStreet(value);
                setStatusToStreet('');
              }}
              //  TODO: filter ignore diacritics
              value={dstStreet}
              options={options}
            />
          </Modal>
          <LineChart
            data={prepareData(dataDelay, dataEvent, t) ?? []}
            xTickValues="every 12 hour"
            yAxisValue={t('plot.Count')}
          ></LineChart>
        </div>
      </Col>
      <Col span={4} className="live-map-top-row">
        <LiveTile
          icon={<Icons.WarningIcon />}
          tileTitle={new Intl.NumberFormat('cs-CZ').format(dataEvent?.features?.length)}
          tileType={t('tile.ActiveAlerts')}
        ></LiveTile>
        <LiveTile
          icon={<Icons.CarIcon />}
          tileTitle={new Intl.NumberFormat('cs-CZ').format(dataDelay?.features?.length)}
          tileType={t('tile.TrafficJams')}
        ></LiveTile>
        <LiveTile
          icon={<Icons.SpeedIcon />}
          tileTitle={new Intl.NumberFormat('pt-PT', {
            style: 'unit',
            unit: 'kilometer-per-hour',
          }).format(
            Number(
              (
                dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.speedKMH, 0) /
                dataDelay?.features?.length
              ).toFixed(2),
            ),
          )}
          tileType={t('tile.AverageSpeed')}
        ></LiveTile>
        <LiveTile
          icon={<Icons.CarIcon />}
          tileTitle={new Intl.NumberFormat('cs-CZ', {
            style: 'unit',
            unit: 'kilometer',
          }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.length, 0) / 1000)}
          tileType={t('tile.JamsLength')}
        ></LiveTile>
        <LiveTile
          icon={<Icons.JamDelayIcon />}
          tileTitle={new Intl.NumberFormat('cs-CZ', {
            style: 'unit',
            unit: 'hour',
          }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.delay, 0) / 3600)}
          tileType={t('tile.JamsDelay')}
        ></LiveTile>
        <LiveTile
          icon={<Icons.JamLevelIcon />}
          tileTitle={(
            dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.level, 0) /
            dataDelay?.features?.length
          ).toFixed(2)}
          tileType={t('tile.AverageJamLevel')}
        ></LiveTile>
      </Col>
    </Row>
  );
};

export default LiveDashboardPage;
