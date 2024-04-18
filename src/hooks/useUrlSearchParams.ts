import React from 'react';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';
import { useSearchParams } from 'react-router-dom';

export const useUrlSearchParams = () => {
  const { filter, setNewFilter } = React.useContext(filterContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const inicialized = React.useRef<Boolean>(false);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (inicialized.current === false) {
      if (searchParams.toString() !== '') {
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
};
