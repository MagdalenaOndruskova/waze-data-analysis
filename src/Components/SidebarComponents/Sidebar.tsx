import { BarChartOutlined, InfoCircleOutlined, LineChartOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CarCrashIcon,
  CarSmallIcon,
  RoadClosedIcon,
  RouteIcon,
  TrafficJamIcon,
  WarningSmallIcon,
} from '../../utils/icons';
import PlotDrawer from './PlotDrawer';
import StatsDrawer from './StatsDrawer';
import EmailModalForm from '../ModalComponents/EmailModalForm';
import StreetsDrawer from './StreetsDrawer';
import { dataContext, filterContext, routeContext, streetContext } from '../../utils/contexts';
import { get_data_delay_alerts } from '../../utils/backendApiRequests';
import { getXMinDate } from '../../utils/util';
import { Checkbox, Tooltip } from 'antd';
import { AdressPoint } from '../../types/baseTypes';

type Props = {
  setOpenInfoModalState: (value: React.SetStateAction<boolean>) => void;

  refStats: React.MutableRefObject<any>;
  refLineStats: React.MutableRefObject<any>;
  refContacForm: React.MutableRefObject<any>;
  refRoute: React.MutableRefObject<any>;
  setRouteStreets: React.Dispatch<any>;
  showMarkers: boolean;
  alertsPoints: AdressPoint;
  map: L.Map;
  setAlertsPoints: React.Dispatch<React.SetStateAction<AdressPoint>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<Boolean>>;
};

const Sidebar = ({
  setOpenInfoModalState,

  refStats,
  refContacForm,
  refLineStats,
  refRoute,
  setRouteStreets,
  showMarkers,
  alertsPoints,
  map,
  setAlertsPoints,
  loading,
  setLoading,
}: Props) => {
  const { t } = useTranslation();
  const { filter } = useContext(filterContext);
  const { streetsInRoute } = useContext(streetContext);

  const { setXAxisData, setJamsData, setAlertData, setDateTimeFrom, setDateTimeTo, setPreviousDate } =
    useContext(dataContext);

  const { route } = useContext(routeContext);

  const [openDrawerPlot, setOpenDrawerPlot] = useState<boolean>(false);
  const [openDrawerRoute, setOpenDrawerRoute] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const [trafficCheck, setTrafficCheck] = useState<boolean>(true);
  const [accident, setTrafficAccident] = useState<boolean>(true);
  const [hazard, setTrafficHazard] = useState<boolean>(true);
  const [roadClosed, setRoadClosed] = useState<boolean>(true);

  useEffect(() => {
    if (!filter) {
      return;
    }

    setDateTimeFrom(`${filter.fromDate}`);
    setDateTimeTo(`${filter.toDate}`);
    setPreviousDate(getXMinDate(filter?.toDate));

    setLoading(true);
    const get_data = async () => {
      const data = await get_data_delay_alerts(filter, route, streetsInRoute);
      setJamsData(data.jams);
      setAlertData(data.alerts);
      setXAxisData(data.xaxis);
      console.log('tu');
      setLoading(false);
    };
    get_data();
  }, [filter]);

  const updateAlerts = (type: string, check: boolean, setFunction: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (check) {
      const alertPointsNew = alertsPoints.map((alert) => {
        if (alert.type === type) {
          return { ...alert, visible: false };
        }
        return alert;
      });
      setAlertsPoints(alertPointsNew);

      setFunction(false);
    } else {
      const alertPointsNew = alertsPoints.map((alert) => {
        if (alert.type === type) {
          return { ...alert, visible: true };
        }
        return alert;
      });
      setAlertsPoints(alertPointsNew);
      setFunction(true);
    }
  };

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', justifyContent: 'space-between' }}>
        <div>
          <div
            onClick={() => {
              setOpenDrawerRoute(true);
            }}
            style={{ paddingBottom: 10 }}
            ref={refRoute}
          >
            <RouteIcon />

            <p>{t('sidebar.route')}</p>
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
        </div>
        {showMarkers && (
          <div style={{ paddingLeft: '5px', display: 'flex', flexDirection: 'column' }}>
            <Tooltip placement="right" title={t('JAM')}>
              <Checkbox onClick={() => updateAlerts('JAM', trafficCheck, setTrafficCheck)} checked={trafficCheck}>
                <TrafficJamIcon />
              </Checkbox>
            </Tooltip>
            <Tooltip placement="right" title={t('ACCIDENT')}>
              <Checkbox onChange={() => updateAlerts('ACCIDENT', accident, setTrafficAccident)} checked={accident}>
                <CarCrashIcon />
              </Checkbox>
            </Tooltip>
            <Tooltip placement="right" title={t('HAZARD')}>
              <Checkbox onChange={() => updateAlerts('HAZARD', hazard, setTrafficHazard)} checked={hazard}>
                <WarningSmallIcon />
              </Checkbox>
            </Tooltip>
            <Tooltip placement="right" title={t('ROAD_CLOSED')}>
              <Checkbox onChange={() => updateAlerts('ROAD_CLOSED', roadClosed, setRoadClosed)} checked={roadClosed}>
                <RoadClosedIcon />
              </Checkbox>
            </Tooltip>
          </div>
        )}
        <div>
          <div
            onClick={() => {
              setOpenInfoModalState(true);
            }}
          >
            <InfoCircleOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>Info</p>
          </div>
          <div
            onClick={() => {
              setOpenEmailModal(true);
            }}
            ref={refContacForm}
          >
            <MailOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>{t('contact')}</p>
          </div>
        </div>
      </div>

      <PlotDrawer open={openDrawerPlot} onCloseDrawer={() => setOpenDrawerPlot(false)} loading={loading} />
      <StatsDrawer
        open={openDrawer}
        onCloseDrawer={() => {
          setOpenDrawer(false);
        }}
      ></StatsDrawer>
      <EmailModalForm openEmailModal={openEmailModal} setOpenEmailModal={setOpenEmailModal} />
      <StreetsDrawer
        openDrawerRoute={openDrawerRoute}
        map={map}
        setOpenDrawerRoute={setOpenDrawerRoute}
        setRouteStreets={setRouteStreets}
        alertsPoints={alertsPoints}
        setAlertsPoints={setAlertsPoints}
      />
    </div>
  );
};

export default Sidebar;
