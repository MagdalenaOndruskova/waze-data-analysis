import React, { useContext, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import { filterContext, streetContext } from '../utils/contexts';
import { useTranslation } from 'react-i18next';
import { NotificationInstance } from 'antd/es/notification/interface';
import { LoadingOutlined } from '@ant-design/icons';
import backendApi from '../utils/api';
import { StreetInMap } from '../types/StreetInMap';
import { deleteFromMap, drawOnMap } from '../utils/map';
import { queryFindStreet } from '../utils/queryBuilder';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { AdressPoint } from '../types/baseTypes';
import dayjs from 'dayjs';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

type Coord = {
  latitude: number;
  longitude: number;
};

type Props = {
  mapMode: string;
  api: NotificationInstance;
  routeStreets: any;
  setRouteStreets: React.Dispatch<any>;
  showMarkers: boolean;
  alertsPoints: AdressPoint;
  mapRef: React.MutableRefObject<L.Map>;
};

const Map = ({ mapMode, api, routeStreets, setRouteStreets, showMarkers, alertsPoints, mapRef }: Props) => {
  const { t } = useTranslation();
  const { streetsInSelected, setNewStreetsInSelected, streetsInMap, setNewStreetsInMap, setNewStreetsInRoute } =
    useContext(streetContext);

  const { filter } = useContext(filterContext);

  const [routeCoordinates, setRouteCoordinates] = useState<Coord[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    var newStreetsInMap: StreetInMap[] = [];

    routeStreets?.forEach((element) => {
      const streetInMapNew: StreetInMap = drawOnMap(map, element?.street_name, element?.path, element?.color);
      newStreetsInMap.push(streetInMapNew);
    });

    setNewStreetsInMap((prevState: StreetInMap[]) => {
      if (prevState.length < 1) {
        return newStreetsInMap;
      }
      const stateCopy = [...prevState];
      const newStreets: StreetInMap[] = [];

      newStreetsInMap.forEach((streetInMap) => {
        const index = prevState.findIndex(({ name }) => name === streetInMap.name);
        if (index > -1) {
          stateCopy[index] = { ...stateCopy[index], lines: [...stateCopy[index].lines, ...streetInMap.lines] };
        } else {
          newStreets.push(streetInMap);
        }
      });
      return [...stateCopy, ...newStreets];
    });
  }, [routeStreets]);

  const MapClickEvent = () => {
    const handleContextMenu = (e) => {
      e.originalEvent.preventDefault();
    };

    useMapEvents({
      contextmenu: handleContextMenu,
      click: async (e) => {
        if (mapMode === 'route') {
          const coord: Coord = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          };
          const map = mapRef.current;
          routeCoordinates.push(coord);

          // var redMarker = L.AwesomeMarkers.icon({
          //   icon: 'fa-university',
          //   prefix: 'fa',
          //   markerColor: 'red',
          //   iconColor: 'white',
          // });
          // L.marker([coord.latitude, coord.longitude], { icon: redMarker }).addTo(map);
          L.marker([coord.latitude, coord.longitude]).addTo(map);

          const last_two = routeCoordinates?.slice(-2);
          if (last_two.length > 1) {
            const data_route = {
              src_coord: [last_two[0].longitude, last_two[0].latitude],
              dst_coord: [last_two[1].longitude, last_two[1].latitude],
              from_time: filter.fromDate,
              to_time: filter.toDate,
            };
            const key = routeCoordinates.length.toString();
            console.log('🚀 ~ click: ~ key:', key);
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
            backendApi
              .post('find_route_by_coord/', data_route)
              .then((response) => {
                setRouteStreets(response.data.streets_coord);
                setNewStreetsInRoute((prevState) => {
                  console.log(prevState);
                  return [
                    ...new Set([...prevState, ...response.data.streets_coord.map((street) => street.street_name)]),
                  ];
                });
              })
              .finally(() => {
                setTimeout(() => {
                  api['success']({
                    key,
                    message: t('route.selection.inProgress'),
                    description: t('route.selection.loading.done'),
                    placement: 'bottomRight',
                  });
                }, 1000);
              });
          }
        } else if (mapMode == 'street') {
          // street
          console.log('street');
          backendApi.get(`reverse_geocode/street/?${queryFindStreet(e, filter)}`).then((response) => {
            const map = mapRef.current;
            const name = response.data.street;
            const path = response.data.path;
            const color = response.data.color;
            deleteFromMap(streetsInMap, name);
            var streetsInMapStaying = streetsInMap.filter((street) => street.name !== name); // keeping everything but the one i deleted
            const newDrawedStreet: StreetInMap = drawOnMap(map, name, path, color);
            streetsInMapStaying.push(newDrawedStreet);
            setNewStreetsInMap(streetsInMapStaying);
            const newStreetsInSelected = [...new Set([...streetsInSelected, name])];
            setNewStreetsInSelected(newStreetsInSelected);
          });
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
