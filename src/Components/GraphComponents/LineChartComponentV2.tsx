import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';
import { colorBlue, colorRed } from '../../utils/constants';

const LineChartComponentV2 = ({ dataFirst, dataSecond, labelFirst, labelSecond, yAxisFirst, xAxis, chartId }) => {
  const { t } = useTranslation();

  const options: ApexOptions = {
    chart: {
      height: 350,
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
        // labels: {
        //   style: {
        //     colors: colorRed,
        //   },
        // },
        title: {
          text: t(`${yAxisFirst}`),
          style: {
            color: colorRed,
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
          // const formattedTime = dayjs(date).format('DD MMM YYYY HH:mm:ss');
          const utcDateString = date.toLocaleString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          return utcDateString;
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
    <div id={chartId} style={{ paddingLeft: '35px', paddingRight: '60px' }}>
      <ReactApexChart options={options} series={options.series} type="line" height={180} />
    </div>
  );
};

export default LineChartComponentV2;
