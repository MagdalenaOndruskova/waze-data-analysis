import { BarChartOutlined, InfoCircleOutlined, LineChartOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteIcon } from '../../utils/icons';
import PlotDrawer from './PlotDrawer';
import StatsDrawer from './StatsDrawer';
import EmailModalForm from '../ModalComponents/EmailModalForm';
import StreetsDrawer from './StreetsDrawer';
import { dataContext, filterContext } from '../../utils/contexts';
import { get_data_delay_alerts } from '../../utils/backendApiRequests';
import { getXMinDate } from '../../utils/util';

type Props = {
  setOpenInfoModalState: (value: React.SetStateAction<boolean>) => void;

  refStats: React.MutableRefObject<any>;
  refLineStats: React.MutableRefObject<any>;
  refContacForm: React.MutableRefObject<any>;
  refRoute: React.MutableRefObject<any>;
  routeStreets: any;
};

const Sidebar = ({
  setOpenInfoModalState,

  refStats,
  refContacForm,
  refLineStats,
  refRoute,
  routeStreets,
}: Props) => {
  const { t } = useTranslation();
  const { filter } = useContext(filterContext);

  const {
    xAxisData,
    jamsData,
    alertData,
    previousDate,
    setXAxisData,
    setJamsData,
    setAlertData,
    setDateTimeFrom,
    setDateTimeTo,
    setPreviousDate,
    setAlertTypes,
  } = useContext(dataContext);

  const [openDrawerPlot, setOpenDrawerPlot] = useState<boolean>(false);
  const [openDrawerRoute, setOpenDrawerRoute] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
