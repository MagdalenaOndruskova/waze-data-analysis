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

const LiveDashboardPage = () => {
  const { filter, setNewStreetsFromMap, streetsFromMapSelected, streetsInMap, setNewStreetsInMap } =
    useContext(filterContext);
  const { streetsWithLocation, streetsInSelected, setNewStreetsWithLocation, setNewStreetsInSelected } =
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
          const address = r.name.split(',');
          if (address.length < 4) {
            // TODO: delete, this is just debug log
            console.log('🚀 ~ file: LiveDashboardPage.tsx:110 ~ geocoder.reverse ~ address:', address);
          }
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
  useEffect(() => {
    const map = mapRef.current;

    filter?.streets?.forEach((street) => {
      const streetInMap = streetsWithLocation.find((item) => item.name === street);
      var linesOfStreet: Polyline[] = [];
      streetInMap?.location?.forEach((path) => {
        const line = L.polyline(path, { color: 'red' });
        line.addTo(map);
        linesOfStreet.push(line);
      });
      if (streetInMap) {
        const streetsInMapNew: StreetInMap[] = [...streetsInMap, { name: streetInMap.name, lines: linesOfStreet }];
        setNewStreetsInMap(streetsInMapNew);
      }
    });
  }, [filter?.streets]);

  // draw streets in map based on selection (before clicking on filter button)
  useEffect(() => {
    const map = mapRef.current;

    if (streetsWithLocation.length > 0 && streetsInSelected.length > 0) {
      streetsInSelected?.forEach((street) => {
        const streetInMap = streetsWithLocation.find((item) => item.name === street);

        var linesOfStreet: Polyline[] = [];
        streetInMap?.location?.forEach((path: L.LatLngExpression[] | L.LatLngExpression[][]) => {
          const line = L.polyline(path, { color: 'red' });
          line.addTo(map);
          linesOfStreet.push(line);
        });
        if (streetInMap) {
          const streetsInMapNew: StreetInMap[] = [...streetsInMap, { name: streetInMap.name, lines: linesOfStreet }];
          setNewStreetsInMap(streetsInMapNew);
        }

        //TODO: Not working:  remove all drawn lines from map
        // if (streetsInSelected.length == 0) {
        //   streetsInMap?.forEach((streetInMap) => {
        //     streetInMap.lines?.forEach((line) => {
        //       line.removeFrom(map);
        //     });
        //   });
        //   setNewStreetsInMap([]);
        // }
      });
    }
  }, [streetsInSelected, streetsWithLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const street = streetsWithLocation.find((item) => item.name === streetsFromMapSelected);
    var linesOfStreet: Polyline[] = [];
    street?.location?.forEach((path) => {
      const line = L.polyline(path, { color: 'red' });
      line.addTo(map);
      linesOfStreet.push(line);
    });
    if (street) {
      const streetsInMapNew: StreetInMap[] = [...streetsInMap, { name: street.name, lines: linesOfStreet }];
      setNewStreetsInMap(streetsInMapNew);
    }
  }, [streetsFromMapSelected]);

  return (
    <Row>
      <Col span={20}>
        <Spin size="large" spinning={loadingDelay || loadingEvent}>
          <MapContainer ref={mapRef} center={[49.2, 16.6]} zoom={14} scrollWheelZoom={true} style={{ height: 580 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingControl />
            <LocationFinderDummy />
          </MapContainer>
        </Spin>
        <div style={{ height: 400 }}>
          <LineChart
            data={prepareData(dataDelay, dataEvent) ?? []}
            xTickValues="every 12 hour"
            yAxisValue="count"
          ></LineChart>
        </div>
      </Col>
      <Col span={4} className="live-map-top-row">
        <LiveTile
          icon={<Icons.WarningIcon />}
          tileTitle={new Intl.NumberFormat('cs-CZ').format(dataEvent?.features?.length)}
          tileType="Active Alerts"
        ></LiveTile>
        <LiveTile
          icon={<Icons.CarIcon />}
          tileTitle={new Intl.NumberFormat('cs-CZ').format(dataDelay?.features?.length)}
          tileType="Traffic Jams"
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
          tileType="Average speed"
        ></LiveTile>
        <LiveTile
          icon={<Icons.CarIcon />}
          tileTitle={new Intl.NumberFormat('pt-PT', {
            style: 'unit',
            unit: 'meter',
          }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.length, 0))}
          tileType="Jams Length"
        ></LiveTile>
        <LiveTile
          icon={<Icons.JamDelayIcon />}
          tileTitle={new Intl.NumberFormat('pt-PT', {
            style: 'unit',
            unit: 'second',
          }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.delay, 0))}
          tileType="Jams Delay"
        ></LiveTile>
        <LiveTile
          icon={<Icons.JamLevelIcon />}
          tileTitle={(
            dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.level, 0) /
            dataDelay?.features?.length
          ).toFixed(2)}
          tileType="Average Jam Level"
        ></LiveTile>
      </Col>
    </Row>
  );
};

export default LiveDashboardPage;
