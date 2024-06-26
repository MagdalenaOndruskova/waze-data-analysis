import React, { useState } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
// import '../../styles/layout-styles.scss';
import { colorBlue, colorRed } from '../../utils/constants';

// TODO: otypovat?

const LineChartComponent = ({ dataJams, dataAlerts, xAxis, xaxis_min_selected, with_timeline = true }) => {
  const { t } = useTranslation();

  const options: ApexOptions = {
    chart: {
      id: 'chart2',
      type: 'line',
      height: 50,
      toolbar: {
        autoSelected: 'pan',
        show: false,
      },
    },
    colors: [colorBlue, colorRed],
    stroke: {
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy hh:mm',
        show: true,
        formatter: function (value) {
          const date = new Date(value);
          // const gmtDateString = date.toUTCString();
          const utcDateString = date.toLocaleString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          // const formattedTime = dayjs(date).format('DD MMM YYYY HH:mm');
          return utcDateString;
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      hover: {
        size: 6,
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
  };
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
        target: 'chart2',
        enabled: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date(`${xaxis_min_selected}`).getTime(),
          max: xAxis?.slice(-1),
        },
      },
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
  };

  return (
    <div className="plot-live-page">
      <div id="chart-line2">
        <ReactApexChart options={options} series={series} type="line" height={230} />
      </div>
      <div>
        {with_timeline ? (
          <div id="chart-line">
            <ReactApexChart options={optionsLine} series={series} type="area" height={130} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LineChartComponent;
