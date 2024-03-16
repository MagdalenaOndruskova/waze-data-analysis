import { Slider, SliderSingleProps } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { colorRed } from '../utils/constants';

type Props = {};

type rangeDateType = {
  startDate: string;
  endDate: string;
};

type rangeValuesType = {
  startValue: number;
  endValue: number;
};

const DateSlider = (props: Props) => {
  const defaultStartDate = dayjs().subtract(1, 'year');
  const defaultEndDate = dayjs();
  const [rangeDate, setRangeDate] = useState<rangeDateType>({
    startDate: defaultStartDate.format('YYYY-MM-DD'),
    endDate: defaultEndDate.format('YYYY-MM-DD'),
  });

  const [value, setValue] = useState<rangeValuesType>({ startValue: 0, endValue: 366 });

  const marks: SliderSingleProps['marks'] = {
    0: {
      style: { color: colorRed },
      label: <strong>{defaultStartDate.format('YYYY-MM-DD')}</strong>,
    },

    366: {
      style: { color: colorRed },
      label: <strong>{defaultEndDate.format('YYYY-MM-DD')}</strong>,
    },
  };

  const handleChange = (value) => {
    setValue({ startValue: value[0], endValue: value[1] });
  };

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <Slider
        range={{ draggableTrack: false }}
        marks={marks}
        min={0}
        max={366}
        step={1}
        value={[value.startValue, value.endValue]}
        onChange={handleChange}
        tooltip={{
          formatter: (value) => {
            return defaultStartDate.add(value, 'days').format('YYYY-MM-DD');
          },
        }}
        onAfterChange={(value) => {
          setRangeDate({
            startDate: defaultStartDate.add(value[0], 'days').format('YYYY-MM-DD'),
            endDate: defaultStartDate.add(value[1], 'days').format('YYYY-MM-DD'),
          });
        }}
      />
    </div>
  );
};

export default DateSlider;
