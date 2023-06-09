import { useState, useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import type { Dayjs } from 'dayjs';

type Props = {
  url: string;
  api: 'jam' | 'event' | 'street';
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  body?: object;
  headers?: object;
  getData?: boolean;
};

type DateFilter = {
  dateFrom: string;
  dateTo: string;
};

const jamApi = `https://gis.brno.cz/ags1/rest/services/Hosted/WazeJams/FeatureServer/0/`;
const eventApi = `https://gis.brno.cz/ags1/rest/services/Hosted/WazeAlerts/FeatureServer/0/`;
const streetApi = 'https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/ulicni_sit/FeatureServer/0/';

const useAxios = <T,>({ url, method = 'get', api, body, headers, getData = false }: Props) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);

  var apiName: String;
  if (api === 'event') {
    apiName = eventApi;
  } else if (api === 'jam') {
    apiName = jamApi;
  } else if (api === 'street') {
    apiName = streetApi;
  }

  const fetchData = () => {
    axios[method]<T>(`${apiName}${url}&outFields=*&outSR=4326&f=json`, headers, body)
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

  useEffect(() => {
    if (getData) {
      fetchData();
    }
  }, [url]);

  return { response, error, loading };
};

export default useAxios;
