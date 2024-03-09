import React, { useContext, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import Brno from '../assets/Brno.png';
import fit from '../assets/fit.png';
import { Button, Col, Modal, Row, Tour, TourProps, message } from 'antd';
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  MailOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import StatsDrawer from '../Components/StatsDrawer';
import SidebarDrawer from '../layout/SidebarDrawer';
import PlotDrawer from '../Components/PlotDrawer';
import { BaseButtonProps } from 'antd/es/button/button';
import { filterContext, streetContext } from '../utils/contexts';
import backendApi from '../utils/api';
import { StreetInMap } from '../types/StreetInMap';
import { deleteFromMap, deleteMultipleFromMap, drawOnMap } from '../utils/map';
import { queryFindStreet, queryStreetCoord } from '../utils/queryBuilder';
import { RouteIcon } from '../utils/icons';

type Props = {};

function findArrayElementByName(array: StreetInMap[], name: string) {
  return array?.find((element) => {
    return element?.name === name;
  });
}

type Coord = {
  latitude: number;
  longitude: number;
};

const FullMap = (props: Props) => {
  const { filter } = useContext(filterContext);
  const { streetsInSelected, setNewStreetsInSelected, streetsInMap, setNewStreetsInMap } = useContext(streetContext);

  const mapRef = useRef<LeafletMap>(null);
  const { t } = useTranslation();

  const refFilter = useRef(null);
  const refStats = useRef(null);
  const refLineStats = useRef(null);
  const refContacForm = useRef(null);
  const refRoute = useRef(null);
  const refDelays = useRef(null);
  const refAlerts = useRef(null);

  const [openInfoModalState, setOpenInfoModalState] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState<boolean>(false);
  const [openDrawerPlot, setOpenDrawerPlot] = useState<boolean>(false);
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [buttonStyle, setButtonStyle] = useState<'default' | 'primary'>('default');
  const [mapMode, setMapMode] = useState<'route' | 'street'>('street');
  const [routeCoordinates, setRouteCoordinates] = useState<Coord[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [routeStreets, setRouteStreets] = useState<any>([]);

  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      target: () => refFilter.current,
    },
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

  const openMenu = () => {
    console.log('hi menu');
  };

  const openMailForm = () => {
    console.log('hi contact');
  };

  const findRoute = () => {
    if (buttonStyle === 'default') {
      setButtonStyle('primary');
      setMapMode('route');
      messageApi.open({
        type: 'info',
        content: 'You can start selecting route from map.',
        style: {
          marginTop: '8vh',
        },
      });
    } else {
      setButtonStyle('default');
      setMapMode('street');
      messageApi.open({
        type: 'success',
        content: 'Selecting route done.',
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
          routeCoordinates.push(coord);
          const last_two = routeCoordinates.slice(-2);
          if (last_two.length > 1) {
            const data_route = {
              src_coord: [last_two[0].longitude, last_two[0].latitude],
              dst_coord: [last_two[1].longitude, last_two[1].latitude],
              from_time: `${filter.fromDate} ${filter.fromTime}:00`,
              to_time: `${filter.toDate} ${filter.toTime}:00`,
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
                console.log('🚀 ~ .then ~ response:', response);
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
          console.log('🚀 ~ click: ~ mapMode:', mapMode);
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
    const map = mapRef.current;
    let newStreetsInMap = streetsInMap;
    // drawing/removing streets in selected
    streetsInSelected?.forEach((element) => {
      if (!findArrayElementByName(newStreetsInMap, element)) {
        backendApi.get(`/street_coord/?${queryStreetCoord(filter, element)}`).then((response) => {
          const name = response.data.street;
          const path = response.data.path;
          const color = response.data.color;
          const newDrawedStreet = drawOnMap(map, name, path, color);
          newStreetsInMap.push(newDrawedStreet);
        });
      }
    });
    const streetsInMapStaying = deleteMultipleFromMap(newStreetsInMap, streetsInSelected);
    setNewStreetsInMap(streetsInMapStaying);
  }, [streetsInSelected]);

  return (
    <div>
      <Row>
        {contextHolder}
        <Modal
          open={openInfoModalState}
          onCancel={() => setOpenInfoModalState(false)}
          title={t('app.title')}
          width={800}
          footer={
            <Row>
              <Col span={5}>
                <a href="https://www.brno.cz/" target="_blank">
                  <img src={Brno} alt="Brno" />
                </a>
              </Col>
              <Col span={12}></Col>
              <Col span={5}>
                <a href="https://www.fit.vut.cz/" target="_blank">
                  <img src={fit} alt="Fakulta informačných technológii VUT" style={{ width: '200px' }} />
                </a>
              </Col>
              <Col span={3}></Col>
            </Row>
          }
        >
          <p>{t('appDescription')}</p>
          <br />
          <div className="modalButtonDiv">
            <Button type="primary" onClick={() => setOpenTour(true)} className="modalButton">
              {t('tourButton')}
            </Button>
          </div>
        </Modal>
        <Col span={1} className="sidermenu">
          <MenuOutlined className="iconStyle" style={{ fontSize: 20, paddingBottom: 10 }} onClick={openMenu} />
          <br></br>
          <div onClick={() => setOpenDrawerFilter(true)} style={{ paddingBottom: 10 }} ref={refFilter}>
            <FilterOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>Filter</p>
          </div>
          <div
            onClick={() => {
              setOpenDrawer(true);
            }}
            style={{ paddingBottom: 10 }}
            ref={refStats}
          >
            <BarChartOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />

            <p>{t('graph.tiles.title')}</p>
          </div>

          <div
            onClick={() => {
              setOpenDrawerPlot(true);
            }}
            style={{ paddingBottom: 10 }}
            ref={refLineStats}
          >
            <LineChartOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />

            <p>{t('graph.priebeh')}</p>
          </div>

          <div
            onClick={() => {
              setOpenInfoModalState(true);
            }}
            style={{
              paddingBottom: 10,
              position: 'absolute',
              bottom: '3%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <InfoCircleOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>Info</p>
          </div>
          <div
            onClick={openMailForm}
            style={{
              paddingBottom: 10,
              position: 'absolute',
              bottom: '-2%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            ref={refContacForm}
          >
            <MailOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>{t('contact')}</p>
          </div>
        </Col>
        <Col span={23} style={{ position: 'relative' }}>
          <div className="divButtonsOnMap">
            <Button className="buttonRoute" ref={refRoute} type={buttonStyle} onClick={findRoute}>
              {t('route.button')}
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
