import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

const data = [
  {
    country: 'AD',
    count: 191,
  },
  {
    country: 'AE',
    count: 197,
  },
  {
    country: 'AF',
    count: 4,
  },
  {
    country: 'AG',
    count: 25,
  },
  {
    country: 'AI',
    count: 105,
  },
  {
    country: 'AL',
    count: 57,
  },
  {
    country: 'AM',
    count: 137,
  },

  {
    country: 'AP',
    count: 156,
  },

  {
    country: 'AK',
    count: 157,
  },

  {
    country: 'AX',
    count: 267,
  },
];

const BarChart = ({ values, legend }) => {
  return (
    <ResponsiveBar
      data={values}
      keys={['count']}
      indexBy="street"
      margin={{ top: 0, right: 30, bottom: 70, left: 50 }}
      padding={0.1}
      layout="horizontal"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'red_blue' }}
      colorBy="indexValue"
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: `Counts`, //${legend}`,
        legendPosition: 'middle',
        legendOffset: 40,
      }}
      axisLeft={null}
      enableGridX={true}
      enableGridY={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 3]],
      }}
    />
  );
};

export default BarChart;
