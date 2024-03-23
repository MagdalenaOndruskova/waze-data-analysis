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
import { dataContext, filterContext } from '../../utils/contexts';
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
  routeStreets: any;
  showMarkers: boolean;
  alertsPoints: AdressPoint;
  setAlertsPoints: React.Dispatch<React.SetStateAction<AdressPoint>>;
};

const Sidebar = ({
  setOpenInfoModalState,

  refStats,
  refContacForm,
  refLineStats,
  refRoute,
  routeStreets,
  showMarkers,
  alertsPoints,
  setAlertsPoints,
}: Props) => {
  const { t } = useTranslation();
  const { filter } = useContext(filterContext);

  const { setXAxisData, setJamsData, setAlertData, setDateTimeFrom, setDateTimeTo, setPreviousDate } =
    useContext(dataContext);

  const [openDrawerPlot, setOpenDrawerPlot] = useState<boolean>(false);
  const [openDrawerRoute, setOpenDrawerRoute] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
      const data = await get_data_delay_alerts(filter);
      setJamsData(data.jams);
      setAlertData(data.alerts);
      setXAxisData(data.xaxis);
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

      {showMarkers && (
        <div style={{ paddingLeft: '5px', paddingTop: '20px' }}>
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
        onClick={() => {
          setOpenEmailModal(true);
        }}
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
        setOpenDrawerRoute={setOpenDrawerRoute}
        routeStreets={routeStreets}
      />
    </div>
  );
};

export default Sidebar;
