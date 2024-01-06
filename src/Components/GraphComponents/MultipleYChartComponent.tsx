import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';

type Props = {};

const MultipleYChartComponent = ({
  dataFirst,
  dataSecond,
  labelFirst,
  labelSecond,
  yAxisFirst,
  yAxisSecond,
  xAxis,
}) => {
  console.log(dataFirst, labelFirst, yAxisFirst);
  console.log(dataSecond, labelSecond, yAxisSecond);
  const { t } = useTranslation();
  const colorBlue = '#247BA0';
  const colorRed = '#FF1654';
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      id: 'chart3',
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
      //   shared: true,
      //   intersect: true,
      x: {
        format: 'dd MMM yyyy hh:mm:ss',
        show: true,
        formatter: function (value) {
          const date = new Date(value);
          const formattedTime = dayjs(date).format('DD MMM YYYY HH:mm:ss');
          return formattedTime;
        },
      },
      //   fixed: {
      //     enabled: true,
      //     position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
      //     offsetY: 30,
      //     offsetX: 60,
      //   },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
      position: 'top',
    },
  };

  return (
    <div id="chart3">
      <ReactApexChart options={options} series={options.series} type="line" height={230} />
    </div>
  );
};

export default MultipleYChartComponent;
