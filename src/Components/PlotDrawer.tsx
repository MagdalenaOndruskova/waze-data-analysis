import { Drawer } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LineChartComponent from './GraphComponents/LineChartComponent';
import { dataContext, filterContext } from '../utils/contexts';
import backendApi from '../utils/api';
import dayjs from 'dayjs';

function getXMinDate(toDate: string) {
  return dayjs(`${toDate}, 06:00:00`, { format: 'YYYY-MM-DD, HH:mm:ss' })
    .subtract(1, 'day')
    .format('YYYY-MM-DD, HH:mm:ss');
}

type Props = {
  open: boolean;
  onCloseDrawer: any;
};

const PlotDrawer = ({ open, onCloseDrawer }: Props) => {
  const { t } = useTranslation();
  const { filter, setNewFilter } = useContext(filterContext);

  const {
    xAxisData,
    jamsData,
    alertData,
    previousDate,
    setXAxisData,
    setJamsData,
    setAlertData,
    dateTimeFrom,
    dateTimeTo,
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
    // already have the data, not necessary to call again - unless street changed! TODO
    if (
      dateTimeFrom === `${filter?.fromDate} ${filter?.fromTime}:00` &&
      dateTimeTo === `${filter?.toDate} ${filter?.toTime}:00`
    ) {
      return;
    } // todo compare dates not string

    if (filter) {
      const body = {
        from_date_time: `${filter?.fromDate} ${filter?.fromTime}:00`,
        to_date_time: `${filter?.toDate} ${filter?.toTime}:00`,
        streets: filter.streets,
      };

      setDateTimeFrom(`${filter.fromDate} ${filter.fromTime}:00`);
      setDateTimeTo(`${filter.toDate} ${filter.toTime}:00`);
      setPreviousDate(getXMinDate(filter?.toDate));

      backendApi.post('data_for_plot/', body).then((response) => {
        setJamsData(response.data.jams);
        setAlertData(response.data.alerts);
        setXAxisData(response.data.xaxis);
        setSpeedData(response.data.speedKMH);
        setTimeData(response.data.delay);
        setLevelData(response.data.level);
        setLengthData(response.data.length);
      });
      backendApi.post('data_for_plot_alerts/', body).then((response) => {
        console.log(response.data);
        setAlertTypes(response.data);
      });
    }
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
      <LineChartComponent
        dataJams={jamsData}
        dataAlerts={alertData}
        xAxis={xAxisData}
        xaxis_min_selected={`${previousDate}`}
        xaxis_max_selected={`${filter?.toDate}, ${filter?.toTime}:00`}
      />
    </Drawer>
  );
};

export default PlotDrawer;
