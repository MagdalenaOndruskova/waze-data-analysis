import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Col, DatePicker, Row, Spin } from 'antd';
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
import { filterContext } from '../utils/contexts';
import L from 'leaflet';
import { Geocoder, geocoders } from 'leaflet-control-geocoder';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { queryBuilder } from '../utils/queryBuilder';

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

type DateFilter = {
  dateFrom: string;
  dateTo: string;
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

const LiveDashboardPage = () => {
  const { filter, setNewFilter, setNewStreetsFromMap, streetsFromMap } = useContext(filterContext);

  const {
    response: dataDelay,
    loading: loadingDelay,
    error: errorDelay,
  } = useAxios<DataDelay>({
    url: `query?where=(${queryBuilder(filter)})`,
    api: 'jam',
  });

  const {
    response: dataEvent,
    loading: loadingEvent,
    error: errorEvent,
  } = useAxios<DataEvent>({
    url: `query?where=(${queryBuilder(filter)})`,
    api: 'event',
  });

  // getting street name from click on map
  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        const geocoder = new geocoders.Nominatim();

        //TODO: zoomlevel to constants -  14 is zoom level
        geocoder.reverse(e.latlng, 14, (result) => {
          var r = result[0];
          var address = r.name.split(',');
          var possibleStreets = address.slice(0, 5);
          possibleStreets = possibleStreets.filter((item) => isNaN(Number(item)));
          possibleStreets = possibleStreets.map((item) => item.trim());
          const blacklist = ['Brno', 'okres Brno-město', 'Jihomoravský kraj', 'Southeast', 'Czechia', 'Město Brno'];
          possibleStreets = possibleStreets.filter((item) => !blacklist.includes(item));

          setNewStreetsFromMap(possibleStreets);
        });
      },
    });
    return null;
  };

  return (
    <div>
      {loadingDelay || loadingEvent ? (
        <div>
          <h1>Loading... </h1>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <Row>
            <Col span={20}>
              <MapContainer center={[49.2, 16.6]} zoom={14} scrollWheelZoom={true} style={{ height: 580 }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationFinderDummy />
              </MapContainer>
              <div style={{ height: 400 }}>
                <LineChart
                  data={prepareData(dataDelay, dataEvent)}
                  xTickValues="every 12 hour"
                  yAxisValue="count"
                ></LineChart>
              </div>
            </Col>
            <Col span={4} className="live-map-top-row">
              <LiveTile
                icon={<Icons.WarningIcon />}
                tileTitle={dataEvent?.features.length}
                tileType="Active Alerts"
              ></LiveTile>
              <LiveTile
                icon={<Icons.CarIcon />}
                tileTitle={dataDelay?.features.length}
                tileType="Traffic Jams"
              ></LiveTile>
              <LiveTile
                icon={<Icons.SpeedIcon />}
                tileTitle={(
                  dataDelay?.features.reduce((sum, { attributes }) => sum + attributes.speedKMH, 0) /
                  dataDelay?.features.length
                ).toFixed(2)}
                tileType="Average speed"
              ></LiveTile>
              <LiveTile
                icon={<Icons.CarIcon />}
                tileTitle={dataDelay?.features.reduce((sum, { attributes }) => sum + attributes.length, 0)}
                tileType="Jams Length [m]"
              ></LiveTile>
              <LiveTile
                icon={<Icons.JamDelayIcon />}
                tileTitle={dataDelay?.features.reduce((sum, { attributes }) => sum + attributes.delay, 0)}
                tileType="Jams Delay [s]"
              ></LiveTile>
              <LiveTile
                icon={<Icons.JamLevelIcon />}
                tileTitle={(
                  dataDelay?.features.reduce((sum, { attributes }) => sum + attributes.level, 0) /
                  dataDelay?.features.length
                ).toFixed(2)}
                tileType="Average Jam Level"
              ></LiveTile>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default LiveDashboardPage;
