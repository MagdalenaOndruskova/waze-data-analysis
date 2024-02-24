import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

type Props = {};

const BarChartComponent = ({ streets, values, id, title }) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        barHeight: 20,
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    colors: [
      '#54040C',
      '#6F0410',
      '#890413',
      '#A90417',
      '#C8041B',
      '#D62821',
      '#E44B26',
      '#F26E2C',
      '#F9802F',
      '#FF9131',
    ],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 0,
      colors: ['#fff'],
    },
    xaxis: {
      categories: streets,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    title: {
      text: title,
      align: 'center',
      floating: true,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return '';
          },
        },
      },
    },
  };
  const series = [
    {
      data: values,
    },
  ];

  return (
    <div id={id}>
      <ReactApexChart options={options} series={series} type="bar" />
    </div>
  );
};

export default BarChartComponent;
