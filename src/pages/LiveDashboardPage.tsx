import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Row, Spin } from 'antd';
import { TrafficDelay } from '../types/TrafficDelay';
import { TrafficEvent } from '../types/TrafficEvent';
import useAxios from '../utils/useAxios';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LiveTile from '../Components/LiveTile';
import * as Icons from '../utils/icons';
import '../styles/main.scss';
import LineChart from '../Components/LineChart';
import { prepareData } from '../utils/prepareData';
import { filterContext, streetContext } from '../utils/contexts';
import { geocoders } from 'leaflet-control-geocoder';
import { queryBuilder } from '../utils/queryBuilder';
import L, { Map as LeafletMap, Polyline } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { StreetInMap } from '../types/StreetInMap';
import { StreetFull } from '../types/StreetFull';
import { useTranslation } from 'react-i18next';

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

// TODO: figure this out, how to use this in app
const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
  { label: 'Today', value: [dayjs().add(0, 'd'), dayjs()] },
  { label: 'Yesterday', value: [dayjs().add(-1, 'd'), dayjs()] },
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];

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

  const mapRef = useRef<LeafletMap>(null);

  const query = queryBuilder(filter);

  const RoutingControl = () => {
    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;

      const control = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        // @ts-ignore
        geocoder: L.Control.Geocoder.nominatim(),
      }).addTo(map);

      return () => {
        // Clean up the control when the component unmounts
        map.removeControl(control);
      };
    }, []);

    return null;
  };
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

  // getting street name from click on map
  const LocationFinderDummy = () => {
    useMapEvents({
      click(e) {
        const geocoder = new geocoders.Nominatim();
        //TODO: zoomlevel to constants -  14 is zoom level
        geocoder.reverse(e.latlng, 14, (result) => {
          const r = result[0];
          console.log('🚀 ~ file: LiveDashboardPage.tsx:114 ~ geocoder.reverse ~ result:', result);
          const address = r.name.split(','); // todo use adress property
          // TODO: delete, this is just debug l og
          console.log('🚀 ~ file: LiveDashboardPage.tsx:110 ~ geocoder.reverse ~ address:', address);

          var possibleStreets = address.slice(0, 5);
          possibleStreets = possibleStreets.filter((item) => isNaN(Number(item)));
          possibleStreets = possibleStreets.map((item) => item.trim());
          const blacklist = ['Brno', 'okres Brno-město', 'Jihomoravský kraj', 'Southeast', 'Czechia', 'Město Brno'];
          possibleStreets = possibleStreets.filter((item) => !blacklist.includes(item));
          var streets = streetsWithLocation?.filter((item) => possibleStreets.includes(item.name));
          if (streets.length > 0) {
            const street = streets[0];
            setNewStreetsInSelected([...new Set([...streetsInSelected, street?.name])]);
          }
        });
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
        <div style={{ height: 400 }}>
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
          tileTitle={new Intl.NumberFormat('pt-PT', {
            style: 'unit',
            unit: 'meter',
          }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.length, 0))}
          tileType={t('tile.JamsLength')}
        ></LiveTile>
        <LiveTile
          icon={<Icons.JamDelayIcon />}
          tileTitle={new Intl.NumberFormat('pt-PT', {
            style: 'unit',
            unit: 'second',
          }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.delay, 0))}
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
