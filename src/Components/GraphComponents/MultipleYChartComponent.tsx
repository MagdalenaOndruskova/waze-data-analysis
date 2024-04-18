import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';
import { colorBlue, colorRed } from '../../utils/constants';

type Props = {};

const MultipleYChartComponent = ({
  dataFirst,
  dataSecond,
  labelFirst,
  labelSecond,
  yAxisFirst,
  yAxisSecond,
  xAxis,
  chartId,
  style,
}) => {
  const { t } = useTranslation();

  const options: ApexOptions = {
    chart: {
      height: 300,
      type: 'line',
      stacked: false,
      id: chartId,
    },

    dataLabels: {
      enabled: false,
    },
    colors: [colorRed, colorBlue],
    series: [
      {
        name: t(`${labelFirst}`),
        data: dataFirst,
      },
      {
        name: t(`${labelSecond}`),
        data: dataSecond,
      },
    ],
    stroke: {
      width: [2, 2],
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
      },
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: true,
      },
      labels: {
        show: true,
      },
      categories: xAxis,
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: colorRed,
        },
        labels: {
          style: {
            colors: colorRed,
          },
        },
        title: {
          text: t(`${yAxisFirst}`),
          style: {
            color: colorRed,
          },
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: colorBlue,
        },
        labels: {
          style: {
            colors: colorBlue,
          },
        },
        title: {
          text: t(`${yAxisSecond}`),
          style: {
            color: colorBlue,
          },
        },
      },
    ],
    tooltip: {
      enabled: true,
      x: {
        format: 'dd MMM yyyy hh:mm:ss',
        show: true,
        formatter: function (value) {
          const date = new Date(value);
          const formattedTime = dayjs(date).format('DD MMM YYYY HH:mm:ss');
          return formattedTime;
        },
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
      position: 'bottom',
    },
  };

  return (
    <div id={chartId} style={style}>
      <ReactApexChart options={options} series={options.series} type="line" height={180} />
    </div>
  );
};

export default MultipleYChartComponent;
