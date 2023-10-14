import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Select, SelectProps, Spin } from 'antd';
import { TrafficDelay } from '../types/TrafficDelay';
import { TrafficEvent } from '../types/TrafficEvent';
import useAxios from '../utils/useAxios';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LiveTile from '../Components/LiveTile';
import * as Icons from '../utils/icons';
import '../styles/main.scss';
import LineChart from '../Components/LineChart';
import { prepareData } from '../utils/prepareData';
import { filterContext, streetContext } from '../utils/contexts';
import { geocoders } from 'leaflet-control-geocoder';
import { queryBuilder } from '../utils/queryBuilder';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { StreetInMap } from '../types/StreetInMap';
import { StreetFull } from '../types/StreetFull';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Street } from '../types/Street';
import { CloseCircleOutlined } from '@ant-design/icons';

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

  // getting street name from click on map
  const LocationFinderDummy = () => {
    useMapEvents({
      click: async (e) => {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/reverse_geocode/street/?longitude=${e.latlng.lng}&latitude=${e.latlng.lat}`,
        );

        var streets = streetsWithLocation?.filter((item) => item.name === data.street);
        if (streets.length > 0) {
          const street = streets[0];
          setNewStreetsInSelected([...new Set([...streetsInSelected, street?.name])]);
        }
      },
    });

    return null;
  };

  // draw streets in map based on selection (before clicking on filter button)
  useEffect(() => {
    if (streetsWithLocation.length < 1 && streetsInSelected.length < 1) {
      // Need both defined - data and also selected streets
      return;
    }
    const map = mapRef.current;

    var streetsInMapNew: StreetInMap[] = [];

    streetsInSelected?.forEach((street: string) => {
      const streetInSelected: StreetFull = streetsWithLocation?.find((item) => item?.name === street);
      if (findArrayElementByName(streetsInMap, streetInSelected?.name)) {
        // checks if street is already drawn
        return;
      } else {
        // street not already drawn, so it should be drawn
        var newStreet: StreetInMap = { name: streetInSelected?.name, lines: [] };
        streetInSelected?.location?.forEach((path: L.LatLngExpression[] | L.LatLngExpression[][]) => {
          const line = L.polyline(path, { color: 'red' }).addTo(map);
          newStreet.lines.push(line);
        });
        streetsInMapNew.push(newStreet);
      }
    });
    const streetsSmth = [...new Set([...streetsInMap, ...streetsInMapNew])];
    const streetsInMapStaying = streetsSmth?.filter((street) => streetsInSelected.includes(street.name));
    const streetsInMapToDelete = streetsSmth?.filter((street) => !streetsInSelected.includes(street.name));
    streetsInMapToDelete?.forEach((street) => {
      street?.lines?.forEach((line) => line.remove());
    });

    setNewStreetsInMap(streetsInMapStaying); // TODO: toto tu treba odkomentovat ale potom sa to rozbije
  }, [streetsInSelected, streetsWithLocation]);

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
    axios.post(`http://127.0.0.1:8000/find_route/`, data_search).then((response) => {
      const newSelected = [...new Set([...streetsInSelected, ...response.data.streets])];
      setNewStreetsInSelected(newSelected);
    });
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    find_route();
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };
  const addPassStreet = () => {
    setPassStreets((prevState) => [...prevState, '']);
  };

  options = getOptionsFromStreet(dataStreets);

  return (
    <Row>
      <Col span={20}>
        <Spin size="large" spinning={loadingDelay || loadingEvent}>
          <MapContainer ref={mapRef} center={[49.2, 16.6]} zoom={14} scrollWheelZoom={true} style={{ height: 580 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <RoutingControl />  */}
            {/* TODO: Uncomment routing control for enabling routing library */}
            <LocationFinderDummy />
          </MapContainer>
        </Spin>
        <div style={{ height: 50 }} className="modalButtonOpen">
          <Button className="filterStyle" onClick={showModal}>
            {t('route.button')}
          </Button>
        </div>
        <div style={{ height: 350 }}>
          <Modal
            width={350}
            title={t('route.button')}
            open={open}
            onCancel={() => setOpen(false)}
            footer={[
              <Button className="modalButton" onClick={addPassStreet}>
                {t('route.pass')}
              </Button>,
              <Button className="modalButton" onClick={handleCancel}>
                {t('cancel')}
              </Button>,
              <Button className="modalButtonOk" onClick={handleOk}>
                OK
              </Button>,
            ]}
          >
            <p>{t('route.source')}:</p>
            <Select
              showSearch
              className="modalStyle"
              allowClear
              placeholder={t('PleaseSelect')}
              onChange={(value) => {
                setSourceStreet(value);
              }}
              //  TODO: filter ignore diacritics
              value={sourceStreet}
              options={options}
            />
            {passStreets.map((street, index) => (
              <>
                {index === 0 && <p>{t('route.pass')}:</p>}
                <Select
                  key={index.toString()}
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
                <CloseCircleOutlined
                  className="iconCancel"
                  key={index.toString() + 'Cancel'}
                  onClick={() => {
                    setPassStreets((prevState) => {
                      const stateCopy = [...prevState];
                      stateCopy.splice(index, 1);
                      return stateCopy;
                    });
                  }}
                />
              </>
            ))}

            <br></br>
            <p>{t('route.dst')}:</p>
            <Select
              showSearch
              className="modalStyle"
              allowClear
              placeholder={t('PleaseSelect')}
              onChange={(value) => {
                setDstStreet(value);
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
