import { GeoData } from './GeoData';
import { TrafficEventTypeEnum } from './TrafficEventTypeEnum';

export type TrafficEvent = GeoData & {
  type: TrafficEventTypeEnum;
  reportRating: number;
  confidence: number;
  reliability: number;
  nThumbsUp: number;
  reportDescription: string;
  subtype: string;
  magvar: number;
};

export class TrafficEventPlot {
  x: Date | string;
  y: number;

  constructor(item: TrafficEvent) {
    this.x = new Date(item.pubMillis);
    this.x;
    this.y = 1;
  }

  roundToNearestHour(date: Date) {
    if (date.getMinutes() >= 0 && date.getMinutes() <= 29) {
      date.setMinutes(0, 0, 0);
    } else if (date.getMinutes() >= 30 && date.getMinutes() <= 59) {
      date.setMinutes(date.getMinutes() + 30);
      date.setMinutes(0, 0, 0);
    }
    this.x = date.toISOString();
  }
}

export class TrafficEventTypePlot {
  id: string;
  count: number;
  label: string;

  constructor(item: TrafficEvent) {
    this.id = item.type;
    this.count = 1;
    this.label = '';
  }
}

export class TrafficEventStreetsPlot {
  street: string;
  count: number;

  constructor(item: TrafficEvent) {
    this.street = item.street;
    this.count = 1;
  }
}
