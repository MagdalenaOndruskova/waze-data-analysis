import React, { useContext, useEffect, useRef, useState } from 'react';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import { Button, Col, Modal, Row, Slider, Tour, TourProps, message } from 'antd';
import { useTranslation } from 'react-i18next';
import StatsDrawer from '../Components/SidebarComponents/StatsDrawer';
import SidebarDrawer from '../layout/SidebarDrawer';
import PlotDrawer from '../Components/SidebarComponents/PlotDrawer';
import { dataContext, filterContext, streetContext } from '../utils/contexts';
import backendApi from '../utils/api';
import { StreetInMap } from '../types/StreetInMap';
import { deleteFromMap, drawOnMap } from '../utils/map';
import { queryFindStreet, queryStreetCoord } from '../utils/queryBuilder';
import { RouteIcon } from '../utils/icons';
import EmailModalForm from '../Components/ModalComponents/EmailModalForm';
import DateSlider from '../Components/DateSlider';
import InfoModal from '../Components/ModalComponents/InfoModal';
import Sidebar from '../Components/SidebarComponents/Sidebar';

type Coord = {
  latitude: number;
  longitude: number;
};

const FullMap = () => {
  const { filter } = useContext(filterContext);
  const { streetsInSelected, setNewStreetsInSelected, streetsInMap, setNewStreetsInMap, newlySelected } =
    useContext(streetContext);

  const { setFullAlerts, setFullJams, setFullXAxis } = useContext(dataContext);

  const mapRef = useRef<LeafletMap>(null);
  const { t } = useTranslation();

  const refStats = useRef(null);
  const refLineStats = useRef(null);
  const refContacForm = useRef(null);
  const refRoute = useRef(null);
  const refDelays = useRef(null);
  const refAlerts = useRef(null);

  const [openInfoModalState, setOpenInfoModalState] = useState<boolean>(false);
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState<boolean>(false);
  const [openDrawerPlot, setOpenDrawerPlot] = useState<boolean>(false);
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [buttonStyle, setButtonStyle] = useState<'default' | 'primary'>('default');
  const [mapMode, setMapMode] = useState<'route' | 'street'>('street');
  const [routeCoordinates, setRouteCoordinates] = useState<Coord[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [routeStreets, setRouteStreets] = useState<any>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const steps: TourProps['steps'] = [
    {
      title: t('graph.tiles.title'),
      description: t('tour.stats.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refStats.current,
    },
    {
      title: t('graph.priebeh'),
      description: t('tour.priebeh.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refLineStats.current,
    },
    {
      title: t('contact'),
      description: t('tour.contact.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refContacForm.current,
    },
    {
      title: t('route.button'),
      description: t('tour.route.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },

      target: () => refRoute.current,
    },
    {
      title: t('Jams'),
      description: t('tour.jams.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refDelays.current,
    },
    {
      title: t('Alerts'),
      description: t('tour.alerts.explained'),
      nextButtonProps: { children: <p>{t('tour.final')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refAlerts.current,
    },
  ];

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
      newSelected.push(element.street_name);
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
    setNewStreetsInSelected([...new Set([...newSelected, ...streetsInSelected])]);
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
        <EmailModalForm openEmailModal={openEmailModal} setOpenEmailModal={setOpenEmailModal} />
        <Col span={1} className="sidermenu">
          <Sidebar
            setOpenDrawer={setOpenDrawer}
            setOpenDrawerPlot={setOpenDrawerPlot}
            setOpenInfoModalState={setOpenInfoModalState}
            setOpenEmailModal={setOpenEmailModal}
            refStats={refStats}
            refLineStats={refLineStats}
            refContacForm={refContacForm}
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
        <StatsDrawer
          open={openDrawer}
          onCloseDrawer={() => {
            setOpenDrawer(false);
          }}
        ></StatsDrawer>
        <SidebarDrawer open={openDrawerFilter} onCloseDrawer={() => setOpenDrawerFilter(false)}></SidebarDrawer>
        <PlotDrawer open={openDrawerPlot} onCloseDrawer={() => setOpenDrawerPlot(false)}></PlotDrawer>
        <Tour open={openTour} onClose={() => setOpenTour(false)} steps={steps} />
      </Row>
    </div>
  );
};

export default FullMap;
