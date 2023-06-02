import { useState, useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import type { Dayjs } from 'dayjs';

type Props = {
  url: string;
  api: 'jam' | 'event' | 'street';
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  body?: object;
  headers?: object;
};

type DateFilter = {
  dateFrom: string;
  dateTo: string;
};

const jamApi = `https://gis.brno.cz/ags1/rest/services/Hosted/WazeJams/FeatureServer`;
const eventApi = `https://gis.brno.cz/ags1/rest/services/Hosted/WazeAlerts/FeatureServer`;
const streetApi = 'https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/ulicni_sit/FeatureServer';

const useAxios = <T,>({ url, method = 'get', api, body, headers }: Props) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);
  // const [dateFilter, setDateFilter] = useState<DateFilter>({ dateFrom: '2023-04-01', dateTo: '2023-04-02' });

  var apiName: String;
  if (api === 'event') {
    apiName = eventApi;
  } else if (api === 'jam') {
    apiName = jamApi;
  } else if (api === 'street') {
    apiName = streetApi;
  }

  const fetchData = () => {
    axios[method]<T>(`${apiName}${url}`, headers, body)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  // const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
  //   if (dates) {
  //     setDateFilter({ dateFrom: dateStrings[0], dateTo: dateStrings[1] });
  //     console.log('🚀 ~ file: LiveDashboardPage.tsx:104 ~ onRangeChange ~ dateFilter:', dateFilter);
  //   } else {
  //     console.log('Clear');
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, [url]); // TODO: Filtre z premennej dostat sem
  // TODO: filter - debounce => lodash

  return { response, error, loading };
};

export default useAxios;
