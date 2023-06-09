import dayjs from 'dayjs';
import {
  TrafficDelay,
  TrafficDelayPlot,
  TrafficDelayStreetsPlot,
  TrafficJamAverageSpeedPlot,
  TrafficJamDelayPlot,
  TrafficJamLengthPlot,
  TrafficJamLevelPlot,
  TrafficJamTypePlot,
} from '../types/TrafficDelay';
import { TrafficEvent, TrafficEventStreetsPlot, TrafficEventTypePlot } from '../types/TrafficEvent';
import { number } from 'prop-types';

type DataDelay = {
  features: {
    attributes: TrafficDelay;
  }[];
};

type DataEvent = {
  features: {
    attributes: TrafficEvent;
  }[];
};

// TODO: Refactor this shit
function prepareDataArray(data: DataDelay | DataEvent | null) {
  var preparedData = data?.features?.map((item) => new TrafficDelayPlot(item.attributes));

  const counts = {};
  preparedData?.forEach(function (item) {
    counts[item.x] = (counts[item.x] || 0) + 1;
  });

  var arrayData = Object.entries(counts);
  var sortedArray = arrayData.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });

  const final = [];
  sortedArray.map((item) => final.push({ x: dayjs(item[0]).format('YYYY-MM-DD HH:mm'), y: item[1] }));

  return final;
}

function prepareDataAlertTypePreprocessing(data: DataEvent | null) {
  var preparedData = data?.features?.map((item) => new TrafficEventTypePlot(item.attributes));

  const counts = {};
  preparedData?.forEach(function (item) {
    counts[item.id] = (counts[item.id] || 0) + 1;
  });

  var arrayData = Object.entries(counts);
  return arrayData;
}

function prepareDataJamTypePreprocessing(data: DataDelay | null) {
  var preparedData = data?.features?.map((item) => new TrafficJamTypePlot(item.attributes));

  const counts = {};
  preparedData?.forEach(function (item) {
    counts[item.id] = (counts[item.id] || 0) + 1;
  });

  var arrayData = Object.entries(counts);
  return arrayData;
}

// TODO: Refactor this shit
function prepareDataJamLevelPreprocessing(data: DataDelay | null) {
  var preparedData = data?.features?.map((item) => new TrafficJamLevelPlot(item.attributes));

  const counts: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    counts[item.x] = (counts[item.x] || 0) + 1;
  });

  const sumsLevel: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    sumsLevel[item.x] = (sumsLevel[item.x] || 0) + item.y;
  });

  const averageLevel: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    averageLevel[item.x] = Number((sumsLevel[item.x] / counts[item.x]).toFixed(2));
  });

  var arrayData = Object.entries(averageLevel);
  var sortedArray = arrayData.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });

  const final = [];
  sortedArray.map((item) => final.push({ x: dayjs(item[0]).format('YYYY-MM-DD HH:mm'), y: item[1] }));

  return final;
}

function prepareDataAverageSpeedPreprocessing(data: DataDelay | null) {
  var preparedData = data?.features?.map((item) => new TrafficJamAverageSpeedPlot(item.attributes));

  const counts: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    counts[item.x] = (counts[item.x] || 0) + 1;
  });

  const sumsLevel: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    sumsLevel[item.x] = (sumsLevel[item.x] || 0) + item.y;
  });

  const averageLevel: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    averageLevel[item.x] = Number((sumsLevel[item.x] / counts[item.x]).toFixed(2));
  });

  var arrayData = Object.entries(averageLevel);
  var sortedArray = arrayData.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });

  const final = [];
  sortedArray.map((item) => final.push({ x: dayjs(item[0]).format('YYYY-MM-DD HH:mm'), y: item[1] }));

  return final;
}

function prepareDataJamLengthPreprocessing(data: DataDelay | null) {
  var preparedData = data?.features?.map((item) => new TrafficJamLengthPlot(item.attributes));

  const sumsLevel: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    sumsLevel[item.x] = (sumsLevel[item.x] || 0) + item.y;
  });

  var arrayData = Object.entries(sumsLevel);
  var sortedArray = arrayData.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });

  const final = [];
  sortedArray.map((item) => final.push({ x: dayjs(item[0]).format('YYYY-MM-DD HH:mm'), y: item[1] }));

  return final;
}

function prepareDataDelayPreprocessing(data: DataDelay | null) {
  var preparedData = data?.features?.map((item) => new TrafficJamDelayPlot(item.attributes));

  const sumsLevel: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    sumsLevel[item.x] = (sumsLevel[item.x] || 0) + item.y;
  });

  var arrayData = Object.entries(sumsLevel);
  var sortedArray = arrayData.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });

  const final = [];
  sortedArray.map((item) => final.push({ x: dayjs(item[0]).format('YYYY-MM-DD HH:mm'), y: item[1] }));

  return final;
}

function prepareStreetsByAlerts(data: DataEvent | null) {
  var preparedData = data?.features?.map((item) => new TrafficEventStreetsPlot(item.attributes));

  const counts: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    if (item.street != null) {
      counts[item.street] = (counts[item.street] || 0) + 1;
    }
  });

  var arrayData = Object.entries(counts);
  var sortedArray = arrayData.sort(function (a, b) {
    return b[1] - a[1];
  });

  const final = [];
  sortedArray.map((item) => final.push({ street: item[0], count: item[1] }));
  const slicedFinal = final.slice(0, 10);

  return slicedFinal;
}

function prepareStreetsByJams(data: DataDelay | null) {
  var preparedData = data?.features?.map((item) => new TrafficDelayStreetsPlot(item.attributes));

  const counts: { [key: string]: number } = {};
  preparedData?.forEach(function (item) {
    if (item.street != null) {
      counts[item.street] = (counts[item.street] || 0) + 1;
    }
  });

  var arrayData = Object.entries(counts);
  console.log('🚀 ~ file: prepareData.tsx:221 ~ prepareStreetsByJams ~ arrayData:', arrayData);
  var sortedArray = arrayData.sort(function (a, b) {
    return b[1] - a[1];
  });

  const final: Array<any> = [];
  sortedArray.map((item) => final.push({ street: item[0], count: item[1] }));
  const slicedFinal = final.slice(0, 10);

  return slicedFinal;
}

export function prepareDataJamLevel(data: DataDelay | null) {
  const preparedData = prepareDataJamLevelPreprocessing(data);
  const plotData = [
    {
      id: 'Average Jam Level',
      data: preparedData,
    },
  ];
  return plotData;
}

export function prepareDataJamLength(data: DataDelay | null) {
  const preparedData = prepareDataJamLengthPreprocessing(data);
  const plotData = [
    {
      id: 'Jam Length',
      data: preparedData,
    },
  ];
  return plotData;
}

export function prepareDataAverageSpeed(data: DataDelay | null) {
  const preparedData = prepareDataAverageSpeedPreprocessing(data);
  const plotData = [
    {
      id: 'Jam Average Speed',
      data: preparedData,
    },
  ];
  return plotData;
}

export function prepareDataDelay(data: DataDelay | null) {
  const preparedData = prepareDataDelayPreprocessing(data);
  const plotData = [
    {
      id: 'Delay',
      data: preparedData,
    },
  ];
  return plotData;
}

export function prepareData(
  dataDelay: DataDelay | null,
  dataEvent: DataEvent | null,
  colorDelay: string = 'hsl(60, 70%, 50%)',
  colorEvent: string = 'hsl(227, 70%, 50%)',
) {
  if (dataDelay != null && dataEvent != null) {
    const plotData = [
      {
        id: 'Jams',
        color: colorDelay,
        data: prepareDataArray(dataDelay),
      },
      {
        id: 'Alerts',
        color: colorEvent,
        data: prepareDataArray(dataEvent),
      },
    ];
    return plotData;
  } else if (dataDelay != null) {
    const plotData = [
      {
        id: 'Jams',
        color: colorDelay,
        data: prepareDataArray(dataDelay),
      },
    ];
    return plotData;
  } else if (dataEvent != null) {
    const plotData = [
      {
        id: 'Alerts',
        color: colorEvent,
        data: prepareDataArray(dataEvent),
      },
    ];
    return plotData;
  }

  return null;
}

export function prepareDataAlertsType(data: DataEvent | null) {
  const preparedData = prepareDataAlertTypePreprocessing(data);
  const plotData: Array<any> = [];
  preparedData?.forEach((item) => {
    var label = '';
    if (item[0] == 'WEATHERHAZARD') {
      label = 'Weather Hazard';
    } else if (item[0] == 'JAM') {
      label = 'Jam';
    } else if (item[0] == 'ROAD_CLOSED') {
      label = 'Road Closed';
    } else if (item[0] == 'ACCIDENT') {
      label = 'Accident';
    }
    plotData.push({
      id: label,
      label: label,
      value: item[1],
    });
  });
  return plotData;
}

export function prepareDataJamType(data: DataDelay | null) {
  const preparedData = prepareDataJamTypePreprocessing(data);
  const plotData: Array<any> = [];

  preparedData?.forEach((item) => {
    var label = '';
    if (item[0] == 'SMALL') {
      label = 'Small';
    } else if (item[0] == 'MEDIUM') {
      label = 'Medium';
    } else if (item[0] == 'LARGE') {
      label = 'Large';
    } else if (item[0] == 'HUGE') {
      label = 'Huge';
    } else if (item[0] == 'NONE') {
      label = 'None';
    }
    plotData.push({
      id: label,
      label: label,
      value: item[1],
    });
  });

  return plotData;
}

export function prepareCriticalStreetsByAlerts(data: DataEvent | null) {
  return prepareStreetsByAlerts(data).reverse();
}

export function prepareCriticalStreetsByJams(data: DataDelay | null) {
  return prepareStreetsByJams(data).reverse();
}
