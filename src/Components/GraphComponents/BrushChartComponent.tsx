import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { colorBlue, colorRed } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { ApexOptions } from 'apexcharts';

const BrushChartComponent = ({ dataJams, dataAlerts, xAxis, xaxis_min_selected, xaxis_max_selected }) => {
  const { t } = useTranslation();

  const series = [
    {
      name: t('Alerts'),
      data: dataAlerts,
    },
    {
      name: t('Jams'),
      data: dataJams,
    },
  ];

  const optionsLine: ApexOptions = {
    chart: {
      id: 'chart1',
      height: 300,
      type: 'area',
      // brush: {
      //   target: '',
      //   enabled: false,
      // },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date(`${xaxis_min_selected}`).getTime(),
          max: new Date(`${xaxis_max_selected}`).getTime(),
        },
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [colorBlue, colorRed],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: false,
      },
      categories: xAxis,
    },
    yaxis: {
      tickAmount: 2,
    },
    tooltip: {
      enabled: true,
      cssClass: 'tooltip',
    },
  };
  console.log(optionsLine.chart.selection.xaxis.min, optionsLine.chart.selection.xaxis.max);

  return (
    <div style={{ width: '100%' }} id="chart-line-timeline">
      <ReactApexChart options={optionsLine} series={series} type="area" height={130} width={10000} />
    </div>
  );
};

export default BrushChartComponent;
