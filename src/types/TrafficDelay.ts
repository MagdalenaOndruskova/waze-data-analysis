import { GeoData } from './GeoData';
import { TrafficJamEnum } from './TrafficJamEnum';

export type TrafficDelay = GeoData & {
  delay: number;
  length: number;
  level: number;
  speed: number;
  speedKMH: number;
  turnType: string;
  endNode: string;
  type: TrafficJamEnum;
};

export class TrafficDelayPlot {
  x: Date | string;
  y: number;

  constructor(item: TrafficDelay) {
    this.x = new Date(item.pubMillis);
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

export class TrafficJamLevelPlot {
  x: Date | string;
  y: number;
  count: number;

  constructor(item: TrafficDelay) {
    this.x = new Date(item.pubMillis);
    this.y = item.level;
    this.count = 1;
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

export class TrafficJamLengthPlot {
  x: Date | string;
  y: number;

  constructor(item: TrafficDelay) {
    this.x = new Date(item.pubMillis);
    this.y = item.length;
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

export class TrafficJamDelayPlot {
  x: Date | string;
  y: number;

  constructor(item: TrafficDelay) {
    this.x = new Date(item.pubMillis);
    this.y = item.delay;
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

export class TrafficJamAverageSpeedPlot {
  x: Date | string;
  y: number;
  count: number;

  constructor(item: TrafficDelay) {
    this.x = new Date(item.pubMillis);
    this.y = item.speedKMH;
    this.count = 1;
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

export class TrafficJamTypePlot {
  id: string;
  count: number;
  label: string;

  constructor(item: TrafficDelay) {
    this.id = item.type;
    this.count = 1;
    this.label = '';
  }
}

export class TrafficDelayStreetsPlot {
  street: string;
  count: number;

  constructor(item: TrafficDelay) {
    this.street = item.street;
    this.count = 1;
  }
}
