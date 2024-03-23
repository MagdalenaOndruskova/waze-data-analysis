import React, { useContext, useEffect, useRef, useState } from 'react';

import L, { Map as LeafletMap } from 'leaflet';
import { Button, Card, Col, Row, Select, SelectProps, message, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { filterContext, streetContext } from '../utils/contexts';
import { StreetInMap } from '../types/StreetInMap';
import { deleteAllFromMap, drawOnMap } from '../utils/map';
import { RouteIcon } from '../utils/icons';
import DateSlider from '../Components/DateSlider';
import InfoModal from '../Components/ModalComponents/InfoModal';
import Sidebar from '../Components/SidebarComponents/Sidebar';
import 'leaflet/dist/leaflet.css';
import ApplicationTour from '../Components/SidebarComponents/ApplicationTour';
import { LoadingOutlined } from '@ant-design/icons';
import * as Icons from '../utils/icons';
import { get_all_street_delays, get_points, get_streets_coord } from '../utils/backendApiRequests';

import Map from '../Components/Map';
import { AdressPoint } from '../types/baseTypes';
import { t } from 'i18next';

type Coord = {
  latitude: number;
  longitude: number;
};

const FullMap = () => {
  const { filter } = useContext(filterContext);
  const { setNewStreetsInSelected, streetsInMap, setNewStreetsInMap, newlySelected } = useContext(streetContext);

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
  const [buttonStyleAlerts, setButtonStyleAlerts] = useState<'default' | 'primary'>('default');
  const [mapMode, setMapMode] = useState<'route' | 'street' | 'nothing'>('street');
  const [api, contextHolder] = notification.useNotification({ stack: { threshold: 3 } });
  const [delayStreets, setDelayStreets] = useState<StreetInMap[]>([]);
  const [showMarkers, setShowMarkers] = useState<boolean>(false);
  const [alertsPoints, setAlertsPoints] = useState<AdressPoint>([]);

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
    setMapMode('nothing');
  };

  const drawDelays = async () => {
    if (buttonStyleDelay === 'default') {
      setButtonStyleDelay('primary');
      setButtonStyle('default');
    } else {
      setButtonStyleDelay('default');
      deleteAllFromMap(delayStreets);
      deleteAllFromMap(streetsInMap);
      setNewStreetsInSelected([]);
      setNewStreetsInMap([]);
      setDelayStreets([]);
      return;
    }

    allDelayData();
  };

  const allAlertData = async () => {
    const key = 'alertData';
    setAlertsPoints([]);

    const openNotification = () => {
      api['info']({
        key,
        message: t('loading.data'),
        description: t('data.alerts.loading'),
        placement: 'bottomRight',
        duration: 0,
        icon: <LoadingOutlined />,
      });
    };
    openNotification();
    const data: AdressPoint = await get_points(filter);
    const newData: AdressPoint = data.map((obj) => ({ ...obj, visible: true }));

    setAlertsPoints(newData);
    setShowMarkers(true);
    setTimeout(() => {
      api['success']({
        key,
        message: t('loading.data'),
        description: t('data.alerts.loading'),
        placement: 'bottomRight',
      });
    }, 1000);
  };
  const drawAlerts = async () => {
    if (buttonStyleAlerts === 'default') {
      setButtonStyleAlerts('primary');
      allAlertData();
    } else {
      setButtonStyleAlerts('default');
      setShowMarkers(false);

      return;
    }
  };

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
    if (buttonStyleAlerts == 'primary') {
      allAlertData();
    }
  }, [filter]);

  return (
    <div>
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
            showMarkers={showMarkers}
            alertsPoints={alertsPoints}
            setAlertsPoints={setAlertsPoints}
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
              {t('Jams')}
              <Icons.CarSmallIcon />
            </Button>
            <Button ref={refAlerts} className="buttonRoute" type={buttonStyleAlerts} onClick={drawAlerts}>
              {t('Alerts')}
              <Icons.WarningSmallIcon />
            </Button>
          </div>

          <Map
            mapMode={mapMode}
            mapRef={mapRef}
            api={api}
            routeStreets={routeStreets}
            setRouteStreets={setRouteStreets}
            showMarkers={showMarkers}
            alertsPoints={alertsPoints}
          />

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
