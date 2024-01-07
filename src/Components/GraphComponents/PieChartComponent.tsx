import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

type Props = {};

const PieChartComponent = ({ values, labels, chartId }) => {
  const { t } = useTranslation();

  const options: ApexOptions = {
    series: values,
    labels: labels?.map((label) => t(label)),

    chart: {
      type: 'donut',
      id: chartId,

      // // Disable responsiveness
      // sparkline: {
      //   enabled: false,
      // },
    },
    legend: {
      position: 'bottom',
    },
  };
  return (
    <div id={chartId} className="pie-chart">
      <ReactApexChart options={options} series={options.series} type="donut" height={270} />
    </div>
  );
};

export default PieChartComponent;
