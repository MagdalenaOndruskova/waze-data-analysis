import React, { useContext, useEffect, useRef, useState } from 'react';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import { Button, Col, Row, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { dataContext, filterContext, streetContext } from '../utils/contexts';
import backendApi from '../utils/api';
import { StreetInMap } from '../types/StreetInMap';
import { deleteFromMap, drawOnMap } from '../utils/map';
import { queryFindStreet, queryStreetCoord } from '../utils/queryBuilder';
import { RouteIcon } from '../utils/icons';
import DateSlider from '../Components/DateSlider';
import InfoModal from '../Components/ModalComponents/InfoModal';
import Sidebar from '../Components/SidebarComponents/Sidebar';
import 'leaflet/dist/leaflet.css';
import ApplicationTour from '../Components/SidebarComponents/ApplicationTour';

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

  const { setFullAlerts, setFullJams, setFullXAxis } = useContext(dataContext);

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
  const [mapMode, setMapMode] = useState<'route' | 'street'>('street');
  const [routeCoordinates, setRouteCoordinates] = useState<Coord[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [routeStreets, setRouteStreets] = useState<any>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const findRoute = () => {
    if (buttonStyle === 'default') {
      setButtonStyle('primary');
      setMapMode('route');
      messageApi.open({
        type: 'info',
        content: t('route.selection.active'),
        style: {
          marginTop: '8vh',
        },
      });
    } else {
      setButtonStyle('default');
      setMapMode('street');
      messageApi.open({
        type: 'success',
        content: t('route.selection.done'),
        style: {
          marginTop: '8vh',
        },
      });
    }
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

          const last_two = routeCoordinates.slice(-2);
          if (last_two.length > 1) {
            const data_route = {
              src_coord: [last_two[0].longitude, last_two[0].latitude],
              dst_coord: [last_two[1].longitude, last_two[1].latitude],
              from_time: filter.fromDate,
              to_time: filter.toDate,
            };
            const message = messageApi.open({
              type: 'loading',
              content: t('routeLoadingInProgress'),
              duration: 0,
              style: {
                marginTop: '8vh',
              },
            });
            backendApi
              .post('find_route_by_coord/', data_route)
              .then((response) => {
                setRouteStreets(response.data.streets_coord);
                message();
                console.log(response.data.streets_coord.map((street) => street.street_name));
                setNewStreetsInRoute((...prevState) => [
                  ...new Set([...prevState, ...response.data.streets_coord.map((street) => street.street_name)]),
                ]);
              })
              .finally(() => {
                messageApi.success({
                  type: 'success',
                  content: t('routeLoadingDone'),
                  duration: 3,
                  style: {
                    marginTop: '8vh',
                  },
                });
              });
          }
        } else {
          // street
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
    var newSelected: string[] = [];

    routeStreets?.forEach((element) => {
      const streetInMapNew: StreetInMap = drawOnMap(map, element.street_name, element?.path, element?.color);
      newStreetsInMap.push(streetInMapNew);
      // newSelected.push(element.street_name);
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
    // setNewStreetsInSelected([...new Set([...newSelected, ...streetsInSelected])]);
  }, [routeStreets]);

  useEffect(() => {
    if (!newlySelected) {
      return;
    }

    const map = mapRef.current;

    const fetchData = async () => {
      const response = await backendApi.get(`/street_coord/?${queryStreetCoord(filter, newlySelected)}`);
      const name = response.data.street;
      const path = response.data.path;
      const color = response.data.color;

      const newDrawedStreet = drawOnMap(map, name, path, color);
      setNewStreetsInMap((prevArray) => [...prevArray, newDrawedStreet]);
    };

    fetchData();
  }, [newlySelected]);

  const get_data = async () => {
    const response = await backendApi.get(`/full_data/`);
    setFullAlerts(response.data.alerts);
    setFullJams(response.data.jams);
    setFullXAxis(response.data.xaxis);
    setLoadingData(false);
  };

  if (loadingData) {
    get_data();
  }

  return (
    <div>
      <Row>
        {contextHolder}
        <InfoModal
          openInfoModalState={openInfoModalState}
          setOpenInfoModalState={setOpenInfoModalState}
          setOpenTour={setOpenTour}
        />
        <Col span={1} className="sidermenu">
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
            <Button ref={refDelays}>{t('Jams')}</Button>
            <Button ref={refAlerts}>{t('Alerts')}</Button>
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
