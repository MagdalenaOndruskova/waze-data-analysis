import backendApi from './api';
import { Filter } from './contexts';

type ResponseDelayAlerts = {
  jams: [];
  alerts: [];
  xaxis: [];
};

type ResponseStats = {
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

function getRequestBody(filter: Filter) {
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
  };
  return data;
}

export async function get_data_stats(filter: Filter) {
  console.log('🚀 ~ get_data_stats ~ get_data_stats:');
  if (!filter) {
    return null;
  }
  const body = getRequestBody(filter);
  const response = await backendApi.post('data_for_plot_stats/', body);
  const data: ResponseStats = {
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
