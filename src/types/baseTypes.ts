import { Street } from './Street';
import { TrafficDelay } from './TrafficDelay';
import { TrafficEvent } from './TrafficEvent';

export type DataDelay = {
  features: {
    attributes: TrafficDelay;
  }[];
};

export type DataEvent = {
  features: {
    attributes: TrafficEvent;
  }[];
};

export type Streets = {
  features: {
    attributes: Street;
    geometry: {
      paths: [];
    };
  }[];
};

export type PlotData = {
  jams: [];
  alerts: [];
  xaxis: [];
};
