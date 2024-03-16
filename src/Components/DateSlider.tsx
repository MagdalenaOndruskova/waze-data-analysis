import { Slider, SliderSingleProps } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { colorRed } from '../utils/constants';
import { filterContext } from '../utils/contexts';

type rangeValuesType = {
  startValue: number;
  endValue: number;
};

const defaultValues = {
  defaultStartDate: dayjs().subtract(1, 'year'),
  defaultEndDate: dayjs(),
  defaultStartValue: 0,
  defaultEndValue: 366,
};

const DateSlider = () => {
  const { filter, setNewFilter } = useContext(filterContext);

  const [value, setValue] = useState<rangeValuesType>({
    startValue: defaultValues.defaultStartValue,
    endValue: defaultValues.defaultEndValue,
  });

  const marks: SliderSingleProps['marks'] = {
    0: {
      style: { color: colorRed },
      label: <strong>{defaultValues.defaultStartDate.format('DD.MM.YYYY')}</strong>,
    },

    366: {
      style: { color: colorRed },
      label: <strong>{defaultValues.defaultEndDate.format('DD.MM.YYYY')}</strong>,
    },
  };

  const handleChange = (value) => {
    setValue({ startValue: value[0], endValue: value[1] });
  };

  useEffect(() => {
    const endValue = defaultValues.defaultEndValue - dayjs().diff(dayjs(filter?.toDate), 'days');
    const startValue = dayjs(filter?.fromDate).diff(defaultValues.defaultStartDate, 'days');
    setValue({ startValue, endValue });
  }, [filter]);

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <Slider
        range={{ draggableTrack: false }}
        marks={marks}
        min={defaultValues.defaultStartValue}
        max={defaultValues.defaultEndValue}
        step={1}
        value={[value.startValue, value.endValue]}
        onChange={handleChange}
        tooltip={{
          formatter: (value) => {
            return defaultValues.defaultStartDate.add(value, 'days').format('DD.MM.YYYY');
          },
        }}
        onAfterChange={(value) => {
          setNewFilter((prevState) => ({
            ...prevState,
            fromDate: defaultValues.defaultStartDate.add(value[0], 'days').format('YYYY-MM-DD'),
            toDate: defaultValues.defaultStartDate.add(value[1], 'days').format('YYYY-MM-DD'),
          }));
        }}
      />
    </div>
  );
};

export default DateSlider;
