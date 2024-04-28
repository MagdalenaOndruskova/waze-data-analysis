import React, { useContext, useEffect, useRef, useState } from 'react';

import L, { Map as LeafletMap, map } from 'leaflet';
import { Button, Card, Col, Row, Select, SelectProps, message, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { filterContext, routeContext, streetContext } from '../utils/contexts';
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
import { get_all_street_delays, get_all_street_alerts, get_streets_coord } from '../utils/backendApiRequests';

import Map from '../Components/Map';
import { AdressPoint } from '../types/baseTypes';
import { t } from 'i18next';
import { useUrlSearchParams } from '../hooks/useUrlSearchParams';
import Icon from '@ant-design/icons/lib/components/Icon';

type Coord = {
  latitude: number;
  longitude: number;
};

function getPinIcon(alert_type: string) {
  if (alert_type == 'JAM') {
    return Icons.pinJam;
  } else if (alert_type == 'HAZARD') {
    return Icons.pinHazard;
  } else if (alert_type == 'ACCIDENT') {
    return Icons.pinCarCrash;
  } else if (alert_type == 'ROAD_CLOSED') {
    return Icons.pinRoadClosed;
  }
  return Icons.pin;
}

const FullMap = () => {
  const { filter } = useContext(filterContext);
  const { streetsInRoute, setNewStreetsInSelected, streetsInMap, setNewStreetsInMap, newlySelected } =
    useContext(streetContext);
  const { route, coordinates } = useContext(routeContext);

  const mapRef = useRef<LeafletMap>(null);
  console.log('🚀 ~ FullMap ~ mapRef:', mapRef);
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
  const [loading, setLoading] = useState<boolean>(false);
  const [showMarkers, setShowMarkers] = useState<boolean>(false);
  const [alertsPoints, setAlertsPoints] = useState<AdressPoint>([]);

  const [routeStreets, setRouteStreets] = useState<any>([]);

  const findRoute = () => {
    if (buttonStyle === 'default') {
      deleteAllFromMap(delayStreets); //odmazem vsetky vykreslene ulice
      setButtonStyle('primary');
      setButtonStyleDelay('default');
      setMapMode('route');
      // TODO: po obdrzani route, filtrovat na ulice ktore su vidiet
    } else {
      setButtonStyle('default');
      setMapMode('street');
    }
  };
  useUrlSearchParams();

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
    // setAlertsPoints([]);

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

    const data: AdressPoint = await get_all_street_alerts(filter, route, streetsInRoute);
    const newData: AdressPoint = data.map((obj) => ({ ...obj, visible: true, icon: getPinIcon(obj.type) }));

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
    if (mapRef.current) {
      if (route.length > 0) {
        coordinates?.forEach((obj) => {
          obj.marker.addTo(mapRef.current);
        });
      }
      streetsInMap?.forEach((obj) => obj.lines?.forEach((line) => line?.addTo(mapRef?.current)));
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (!newlySelected) {
      return;
    }

    const map = mapRef.current;
    console.log(newlySelected);
    const fetchData = async () => {
      const isMatched = streetsInMap.some((street) => street.name === newlySelected);

      if (!isMatched) {
        const data = await get_streets_coord(filter, newlySelected);
        const newStreets = [];
        data?.streets?.forEach((element) => {
          const newDrawedStreet: StreetInMap = drawOnMap(map, element.street_name, element.path, element.color);
          newStreets.push(newDrawedStreet);
        });
        setNewStreetsInMap((prevState) => [...prevState, ...newStreets]);

        return data;
      }
    };

    fetchData();
  }, [newlySelected]);

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
            map={mapRef.current}
            refLineStats={refLineStats}
            refContacForm={refContacForm}
            refRoute={refRouteSidebar}
            setRouteStreets={setRouteStreets}
            showMarkers={showMarkers}
            alertsPoints={alertsPoints}
            setAlertsPoints={setAlertsPoints}
            loading={loading}
            setLoading={setLoading}
          />
        </Col>
        <Col span={23} style={{ position: 'relative', flex: '1', maxWidth: 'unset' }}>
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
            setMapMode={setMapMode}
            loading={loading}
            setLoading={setLoading}
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
