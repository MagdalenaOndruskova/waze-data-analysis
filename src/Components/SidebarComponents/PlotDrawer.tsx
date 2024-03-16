import { Drawer, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LineChartComponent from '../GraphComponents/LineChartComponent';
import { dataContext, filterContext } from '../../utils/contexts';
import backendApi from '../../utils/api';
import dayjs from 'dayjs';

function getXMinDate(toDate: string) {
  return dayjs(`${toDate}`, { format: 'YYYY-MM-DD' }).subtract(2, 'day').format('YYYY-MM-DD');
}

type Props = {
  open: boolean;
  onCloseDrawer: any;
};

const PlotDrawer = ({ open, onCloseDrawer }: Props) => {
  const { filter } = useContext(filterContext);
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);

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
    setLengthData,
    setLevelData,
    setSpeedData,
    setTimeData,
    setAlertTypes,
  } = useContext(dataContext);

  useEffect(() => {
    if (!filter) {
      return;
    }
    const body = {
      from_date: filter?.fromDate,
      to_date: filter?.toDate,
      streets: filter.streets,
    };
    setLoading(true);

    setDateTimeFrom(`${filter.fromDate}`);
    setDateTimeTo(`${filter.toDate}`);
    setPreviousDate(getXMinDate(filter?.toDate));

    backendApi.post('data_for_plot_drawer/', body).then((response) => {
      setJamsData(response.data.jams);
      setAlertData(response.data.alerts);
      setXAxisData(response.data.xaxis);
      setLoading(false);
    });
    backendApi.post('data_for_plot/', body).then((response) => {
      setSpeedData(response.data.speedKMH);
      setTimeData(response.data.delay);
      setLevelData(response.data.level);
      setLengthData(response.data.length);
    });
    backendApi.post('data_for_plot_alerts/', body).then((response) => {
      setAlertTypes(response.data);
    });
  }, [filter]);

  return (
    <Drawer
      className="sidebar-drawer"
      title={null}
      placement="bottom"
      onClose={onCloseDrawer}
      open={open}
      width={500}
      height={450}
      closable={true}
      zIndex={10000}
    >
      <Spin tip={t('loading.data')} size="large" spinning={loading}>
        <LineChartComponent
          dataJams={jamsData}
          dataAlerts={alertData}
          xAxis={xAxisData}
          xaxis_min_selected={`${previousDate}`}
        />
      </Spin>
    </Drawer>
  );
};

export default PlotDrawer;
