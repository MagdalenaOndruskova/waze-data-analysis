import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LineChart = ({ data, xTickValues, yAxisValue }) => {
  const { t } = useTranslation();
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 5, right: 60, bottom: 110, left: 60 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d %H:%M',
      }}
      xFormat="time:%Y-%m-%d %H:%M"
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisValue,
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      axisBottom={{
        format: '%Y-%m-%d %H:%M',
        tickValues: xTickValues,
        tickRotation: -45,
        tickPadding: 5,
        tickSize: 5,
        legend: t('plot.DateAndTime'),
        legendOffset: 85,
        legendPosition: 'middle',
      }}
      colors={{ scheme: 'category10' }}
      enablePoints={false}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices="x"
      crosshairType="x"
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          translateX: 25, // todo parametrize
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
