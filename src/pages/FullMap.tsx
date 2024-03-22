import React, { useContext, useEffect, useRef, useState } from 'react';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import { Button, Col, Row, message, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { dataContext, filterContext, streetContext } from '../utils/contexts';
import backendApi from '../utils/api';
import { StreetInMap } from '../types/StreetInMap';
import { deleteAllFromMap, deleteFromMap, drawOnMap } from '../utils/map';
import { queryFindStreet, queryStreetCoord } from '../utils/queryBuilder';
import { RouteIcon } from '../utils/icons';
import DateSlider from '../Components/DateSlider';
import InfoModal from '../Components/ModalComponents/InfoModal';
import Sidebar from '../Components/SidebarComponents/Sidebar';
import 'leaflet/dist/leaflet.css';
import ApplicationTour from '../Components/SidebarComponents/ApplicationTour';
import { LoadingOutlined } from '@ant-design/icons';
import * as Icons from '../utils/icons';
import { get_all_street_delays, get_streets_coord } from '../utils/backendApiRequests';

type Coord = {
  latitude: number;
  longitude: number;
};

const FullMap = () => {
  const { filter } = useContext(filterContext);
  const {
    streetsInSelected,
    setNewStreetsInSelected,
    streetsInMap,
    setNewStreetsInMap,
    newlySelected,
    setNewStreetsInRoute,
  } = useContext(streetContext);

  const mapRef = useRef<LeafletMap>(null);
  const { t } = useTranslation();

  const refStats = useRef(null);
  const refLineStats = useRef(null);
  const refContacForm = useRef(null);
  const refRoute = useRef(null);
  const refDelays = useRef(null);
  const refAlerts = useRef(null);
  const refRouteSidebar = useRef(null);

  const [openInfoModalState, setOpenInfoModalState] = useState<boolean>(false);
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [buttonStyle, setButtonStyle] = useState<'default' | 'primary'>('default');
  const [buttonStyleDelay, setButtonStyleDelay] = useState<'default' | 'primary'>('default');
  const [mapMode, setMapMode] = useState<'route' | 'street'>('street');
  const [routeCoordinates, setRouteCoordinates] = useState<Coord[]>([]);
  const [api, contextHolder] = notification.useNotification({ stack: { threshold: 3 } });
  const [delayStreets, setDelayStreets] = useState<StreetInMap[]>([]);

  const [routeStreets, setRouteStreets] = useState<any>([]);

  const findRoute = () => {
    if (buttonStyle === 'default') {
      deleteAllFromMap(delayStreets); //odmazem vsetky vykreslene ulice
      setButtonStyle('primary');
      setButtonStyleDelay('default');
      setMapMode('route');
    } else {
      setButtonStyle('default');
      setMapMode('street');
    }
  };

  const allDelayData = async () => {
    const map = mapRef.current;
    deleteAllFromMap(delayStreets);
    const key = 'data_delay';
    const openNotification = () => {
      api['info']({
        key,
        message: t('loading.data'),
        description: t('data.delay.loading'),
        placement: 'bottomRight',
        duration: 0,
        icon: <LoadingOutlined />,
      });
    };
    openNotification();
    const data = await get_all_street_delays(filter);
    const streets: StreetInMap[] = [];
    data?.forEach((element) => {
      streets.push(drawOnMap(map, element?.street, element?.path, element?.color));
    });
    setDelayStreets(streets);
    setTimeout(() => {
      api['success']({
        key,
        message: t('loading.data'),
        description: t('data.delay.loading'),
        placement: 'bottomRight',
      });
    }, 1000);
  };

  const drawDelays = async () => {
    console.log(buttonStyleDelay);
    if (buttonStyleDelay === 'default') {
      setButtonStyleDelay('primary');
      setButtonStyle('default');
      setMapMode('route');
    } else {
      setButtonStyleDelay('default');
      deleteAllFromMap(delayStreets);
      deleteAllFromMap(streetsInMap);
      setNewStreetsInSelected([]);
      setNewStreetsInMap([]);
      setDelayStreets([]);
      setMapMode('street');
      return;
    }

    allDelayData();
  };

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
        } else {
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

  useEffect(() => {
    if (!newlySelected) {
      return;
    }

    const map = mapRef.current;

    const fetchData = async () => {
      const data = await get_streets_coord(filter, newlySelected);
      const newDrawedStreet = drawOnMap(map, data?.name, data?.path, data?.color);
      setNewStreetsInMap((prevArray) => [...prevArray, newDrawedStreet]);
    };

    fetchData();
  }, [newlySelected]);

  useEffect(() => {
    if (buttonStyleDelay == 'primary') {
      allDelayData();
    }
  }, [filter]);

  return (
    <div>
      {/* TODO: component? */}
      <Row style={{ flexFlow: 'unset' }}>
        {contextHolder}
        <InfoModal
          openInfoModalState={openInfoModalState}
          setOpenInfoModalState={setOpenInfoModalState}
          setOpenTour={setOpenTour}
        />
        <Col className="sidermenu">
          <Sidebar
            setOpenInfoModalState={setOpenInfoModalState}
            refStats={refStats}
            refLineStats={refLineStats}
            refContacForm={refContacForm}
            refRoute={refRouteSidebar}
            routeStreets={routeStreets}
          />
        </Col>
        <Col span={23} style={{ position: 'relative' }}>
          <div className="divButtonsOnMap">
            <Button className="buttonRoute" ref={refRoute} type={buttonStyle} onClick={findRoute}>
              {buttonStyle == 'default' && t('route.button')}
              {buttonStyle == 'primary' && t('route.button.active')}
              <RouteIcon />
            </Button>
            <Button ref={refDelays} className="buttonRoute" type={buttonStyleDelay} onClick={drawDelays}>
              {t('Jams')} <RouteIcon />
              {/* <Icons.CarIcon /> */}
            </Button>
            <Button ref={refAlerts} className="buttonRoute">
              {t('Alerts')} <RouteIcon />
              {/* <Icons.WarningIcon /> */}
            </Button>
          </div>

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
          </MapContainer>
          <div className="divTimelineOnMap">
            <DateSlider />
          </div>
        </Col>

        <ApplicationTour
          refStats={refStats}
          refLineStats={refLineStats}
          refContacForm={refContacForm}
          refRoute={refRoute}
          refRouteSidebar={refRouteSidebar}
          refDelays={refDelays}
          refAlerts={refAlerts}
          openTour={openTour}
          setOpenTour={setOpenTour}
        ></ApplicationTour>
      </Row>
    </div>
  );
};

export default FullMap;
