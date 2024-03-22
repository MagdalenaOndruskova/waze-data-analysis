import backendApi from './api';
import { Filter } from './contexts';
import { queryStreetCoord, queryTime } from './queryBuilder';

type ResponseDelayAlerts = {
  jams: [];
  alerts: [];
  xaxis: [];

  speedKMH: [];
  time: [];
  level: [];
  length: [];
};

type ResponseCriticalStreets = {
  streets_jams: [];
  values_jams: [];

  streets_alerts: [];
  values_alerts: [];
};

type ResponseStreetsDrawing = {
  name: string;
  path: [[]];
  color: string;
};

function getRequestBody(filter: Filter) {
  console.log('🚀 ~ getRequestBody ~ filter:', filter);

  const body = {
    from_date: filter?.fromDate,
    to_date: filter?.toDate,
    streets: filter?.streets,
  };
  return body;
}

export async function get_data_delay_alerts(filter: Filter) {
  console.log('🚀 ~ get_data_delay_alerts ~ get_data_delay_alerts');
  if (!filter) {
    return null;
  }
  const body = getRequestBody(filter);
  const response = await backendApi.post('data_for_plot_drawer/', body);
  const data: ResponseDelayAlerts = {
    jams: response.data.jams,
    alerts: response.data.alerts,
    xaxis: response.data.xaxis,
    speedKMH: response.data.speedKMH,
    time: response.data.delay,
    level: response.data.level,
    length: response.data.length,
  };
  return data;
}

export async function get_data_critical_streets(filter: Filter) {
  console.log('🚀 ~ get_data_critical_streets ~ get_data_critical_streets:');
  if (!filter) {
    return;
  }
  const body = getRequestBody(filter);
  const response = await backendApi.post('data_for_plot_streets/', body);
  const data: ResponseCriticalStreets = {
    streets_jams: response.data.streets_jams,
    values_jams: response.data.values_jams,
    streets_alerts: response.data.streets_alerts,
    values_alerts: response.data.values_alerts,
  };
  return data;
}

export async function get_data_alert_types(filter: Filter) {
  console.log('🚀 ~ get_data_alert_types ~ get_data_alert_types:');

  if (!filter) {
    return;
  }
  console.log('alerts');
  const body = getRequestBody(filter);
  const response = await backendApi.post('data_for_plot_alerts/', body);
  return response.data;
}

export async function get_streets_coord(filter: Filter, newlySelected: string) {
  const response = await backendApi.get(`/street_coord/?${queryStreetCoord(filter, newlySelected)}`);
  const data: ResponseStreetsDrawing = {
    name: response.data.street,
    path: response.data.path,
    color: response.data.color,
  };
  return data;
}

export async function get_all_street_delays(filter: Filter) {
  const response = await backendApi.get(`/all_delays/?${queryTime(filter)}`);
  const data = response.data;
  return data;
}
