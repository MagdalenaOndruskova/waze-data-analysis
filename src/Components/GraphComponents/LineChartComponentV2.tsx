import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';

const LineChartComponentV2 = ({ dataFirst, dataSecond, labelFirst, labelSecond, yAxisFirst, xAxis, chartId }) => {
  const { t } = useTranslation();
  const colorBlue = '#247BA0';
  const colorRed = '#d4041c';

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
    <div id={chartId}>
      <ReactApexChart options={options} series={options.series} type="line" height={180} />
    </div>
  );
};

export default LineChartComponentV2;
