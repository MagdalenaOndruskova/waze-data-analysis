import { Filter } from './contexts';

export const queryBuilder = (filter: Filter) => {
  if (filter !== null) {
    var finalQuery = `city='Brno'`;
    const dateFromFinal = `${filter.fromDate}`;
    const dateToFinal = `${filter.toDate}`;
    finalQuery = `${finalQuery} AND pubMillis >= TIMESTAMP '${dateFromFinal}' AND pubMillis <= TIMESTAMP '${dateToFinal}'`;

    if (filter.streets.length > 0) {
      const streetsValues = `('${filter.streets.join(`', '`)}')`;
      finalQuery = `${finalQuery} AND street IN ${streetsValues}`;
    }
    return finalQuery;
  }
  return '';
};

export const queryFindStreet = (e: L.LeafletMouseEvent, filter: Filter) => {
  if (filter !== null && e !== null) {
    var finalQuery = `longitude=${e.latlng.lng}&latitude=${e.latlng.lat}`;
    const dateFromFinal = `&fromTime=${filter.fromDate}`;
    const dateToFinal = `&toTime=${filter.toDate}`;
    finalQuery = `${finalQuery}${dateFromFinal}${dateToFinal}`;
    return finalQuery;
  }
  return '';
};

export const queryStreetCoord = (filter: Filter, street: string) => {
  if (filter != null) {
    const finalQuery = `street=${street}&fromTime=${filter.fromDate}&toTime=${filter.toDate}`;
    return finalQuery;
  }
  return '';
};

export const queryTime = (filter: Filter) => {
  if (filter != null) {
    const finalQuery = `fromTime=${filter.fromDate}&toTime=${filter.toDate}`;
    return finalQuery;
  }
  return '';
};
