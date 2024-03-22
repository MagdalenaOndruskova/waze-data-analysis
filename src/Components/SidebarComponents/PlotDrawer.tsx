import { Drawer, Spin } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LineChartComponent from '../GraphComponents/LineChartComponent';
import { dataContext } from '../../utils/contexts';

type Props = {
  open: boolean;
  onCloseDrawer: any;
  loading: boolean;
};

const PlotDrawer = ({ open, onCloseDrawer, loading }: Props) => {
  const { t } = useTranslation();

  const { xAxisData, jamsData, alertData, previousDate } = useContext(dataContext);

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
