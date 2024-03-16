import { Slider, SliderSingleProps } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { colorRed } from '../utils/constants';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';
import { useSearchParams } from 'react-router-dom';

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

  const [searchParams, setSearchParams] = useSearchParams();

  const [value, setValue] = useState<rangeValuesType>({
    startValue: defaultValues.defaultStartValue,
    endValue: defaultValues.defaultEndValue,
  });

  const inicialized = useRef<Boolean>(false);

  useEffect(() => {
    if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
      const { fromDate, toDate } = filter;
      setSearchParams({
        fromDate,
        toDate,
        streets: `('${filter.streets.join(`', '`)}')`,
      });
    } else {
      if (inicialized.current === true) {
        setSearchParams({});
      }
    }
  }, [filter]);

  useEffect(() => {
    if (inicialized.current === false) {
      if (filter === null && searchParams.toString() !== '') {
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        var streets = searchParams.get('streets');

        // TODO: check when creating url params, so that when no street, dont have this url param
        var streetsSplitted = [];
        if (streets !== "('')") {
          streets = streets.replaceAll("'", '');
          streets = streets.replaceAll('(', '');
          streets = streets.replaceAll(')', '');
          streetsSplitted = streets.split(',');
          streetsSplitted = streetsSplitted.map((item) => item.trim());
        }
        setNewFilter({ fromDate, toDate, streets: streetsSplitted });
        inicialized.current = true;
      }
      if (searchParams.toString() === '') {
        setNewFilter(FILTER_DEFAULT_VALUE.filterDefaultValue);
      }
    }
  }, [searchParams, inicialized]);

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
