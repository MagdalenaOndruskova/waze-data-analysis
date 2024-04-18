import React, { useContext, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import { dataContext, filterContext, routeContext, streetContext } from '../utils/contexts';
import { useTranslation } from 'react-i18next';
import { NotificationInstance } from 'antd/es/notification/interface';
import { LoadingOutlined } from '@ant-design/icons';
import { StreetInMap } from '../types/StreetInMap';
import { drawOnMap } from '../utils/map';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { AdressPoint, Coord } from '../types/baseTypes';
import dayjs from 'dayjs';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { get_data_delay_alerts, get_route, reverse_geocode } from '../utils/backendApiRequests';

type Props = {
  mapMode: string;
  api: NotificationInstance;
  routeStreets: any;
  setRouteStreets: React.Dispatch<any>;
  showMarkers: boolean;
  alertsPoints: AdressPoint;
  mapRef: React.MutableRefObject<L.Map>;
  setMapMode: React.Dispatch<React.SetStateAction<'route' | 'street' | 'nothing'>>;
};

const Map = ({ mapMode, api, routeStreets, setRouteStreets, showMarkers, alertsPoints, mapRef, setMapMode }: Props) => {
  const { t } = useTranslation();
  const { setNewStreetsInSelected, setNewStreetsInMap, setNewStreetsInRoute, streetsInRoute } =
    useContext(streetContext);
  const { filter, setNewFilter } = useContext(filterContext);
  const { coordinates, setNewCoordinates, setNewRoute, route } = useContext(routeContext);
  const { setXAxisData, setJamsData, setAlertData, setDateTimeFrom, setDateTimeTo, setPreviousDate } =
    useContext(dataContext);

  const MapClickEvent = () => {
    const handleContextMenu = (e) => {
      e.originalEvent.preventDefault();
    };

    useMapEvents({
      contextmenu: handleContextMenu,
      click: async (e) => {
        const map = mapRef.current;

        if (mapMode === 'route') {
          const marker = L.marker([e.latlng.lat, e.latlng.lng]);
          marker.addTo(map);

          const coord: Coord = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            marker: marker,
            street: '',
          };
          coordinates.push(coord);
          const lastIndex = coordinates ? coordinates.length - 1 : -1;
          const secondLastIndex = lastIndex - 1;

          const last_two = coordinates?.slice(-2);
          if (last_two.length > 1) {
            const key = coordinates.length.toString();
            const openNotification = () => {
              api['info']({
                key,
                message: t('route.selection.inProgress'),
                description: t('route.selection.loading'),
                placement: 'bottomRight',
                duration: 0,
                icon: <LoadingOutlined />,
              });
            };
            openNotification();
            const response = await get_route(last_two[0], last_two[1], filter);

            if (response.streets_coord.length < 1) {
              const removedCoord: Coord = coordinates.pop();
              setNewCoordinates(coordinates);
              removedCoord.marker.remove();
              console.log(coordinates);
              setTimeout(() => {
                api['error']({
                  key,
                  message: 'route not found', // t('route.selection.inProgress'),
                  description: 'Select different points - ideally with multiple pass points', // t('route.selection.loading.done'),
                  placement: 'bottomRight',
                });
              }, 1000);
              return;
            }
            setRouteStreets(response.streets_coord);
            setNewStreetsInRoute((prevState) => {
              return [...new Set([...prevState, ...response.streets_coord.map((street) => street.street_name)])];
            });
            setNewCoordinates((prevData) => {
              const newData = [...prevData];
              newData[lastIndex] = { ...newData[lastIndex], street: response.dst_street };
              newData[secondLastIndex] = { ...newData[secondLastIndex], street: response.src_street };
              return newData;
            });
            setNewRoute((prevData) => {
              return [...prevData, ...response.route];
            });
            const data = await get_data_delay_alerts(filter, route, streetsInRoute);
            setJamsData(data.jams);
            setAlertData(data.alerts);
            setXAxisData(data.xaxis);
            setTimeout(() => {
              api['success']({
                key,
                message: t('route.selection.inProgress'),
                description: t('route.selection.loading.done'),
                placement: 'bottomRight',
              });
            }, 1000);
          }
        } else if (mapMode == 'street') {
          // street
          const fetchReverseStreet = async () => {
            const key = 'loading street';
            const openNotification = () => {
              api['info']({
                key,
                message: 'todo preklad',
                description: 'Loading street',
                placement: 'bottomRight',
                duration: 0,
                icon: <LoadingOutlined />,
              });
            };
            openNotification();
            const data = await reverse_geocode(filter, e);
            const newStreets = [];
            const streets = [];
            data?.streets?.forEach((element) => {
              const newDrawedStreet: StreetInMap = drawOnMap(map, element.street_name, element.path, element.color);
              newStreets.push(newDrawedStreet);
              streets.push(element.street_name);
            });
            setNewStreetsInMap((prevState) => [...prevState, ...newStreets]);
            setNewStreetsInSelected((prevState) => [...new Set([...prevState, ...streets])]);
            setNewFilter((prevState) => ({
              ...prevState,
              streets: [...new Set([...prevState.streets, ...streets])],
            }));
            setTimeout(() => {
              api['success']({
                key,
                message: t('route.selection.inProgress'),
                description: 'Street loaded succesfully',
                placement: 'bottomRight',
              });
            }, 1000);
          };
          fetchReverseStreet();
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      ref={mapRef}
      center={[49.194391, 16.612064]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: 'calc(100dvh - 50px)', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickEvent />
      {showMarkers && (
        <MarkerClusterGroup chunkedLoading>
          {(alertsPoints as AdressPoint).map(
            (alert) =>
              alert?.visible && (
                <Marker key={alert['key']} position={[alert['latitude'], alert['longitude']]}>
                  <Popup>
                    {t('type')}: {t(alert['type'])}
                    {alert['subtype'] && (
                      <p>
                        {t('subtype')}: {t(alert['subtype'])}
                      </p>
                    )}
                    {alert['street'] && (
                      <p>
                        {t('street')}: {alert['street']}
                      </p>
                    )}
                    <p>
                      {t('pubMillis')}: {dayjs(alert['pubMillis']).format('DD.MM.YYYY HH:mm')}
                    </p>
                  </Popup>
                </Marker>
              ),
          )}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
};

export default Map;
