import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

type Props = {};

const ChartTimelineComponent = ({ dataJams, dataAlerts, xAxis, xaxis_min_selected, xaxis_max_selected, targets }) => {
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
      brush: {
        enabled: true,
        targets: targets,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date(`${xaxis_min_selected}`).getTime(),
          max: new Date(`${xaxis_max_selected}`).getTime(),
        },
      },
    },
    colors: ['#247BA0', '#d4041c'],
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
  };

  return (
    <div id="chart-line">
      <ReactApexChart options={optionsLine} series={series} type="area" height={130} />
    </div>
  );
};

export default ChartTimelineComponent;
