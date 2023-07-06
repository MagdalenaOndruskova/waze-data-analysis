import { Filter } from './contexts';

export const queryBuilder = (filter: Filter) => {
  var finalQuery = `city='Brno'`;
  const dateFromFinal = `${filter.fromDate} ${filter.fromTime}:00`;
  const dateToFinal = `${filter.toDate} ${filter.toTime}:00`;
  finalQuery = `${finalQuery} AND pubMillis >= TIMESTAMP '${dateFromFinal}' AND pubMillis <= TIMESTAMP '${dateToFinal}'`;

  if (filter.streets.length > 0) {
    const streetsValues = `('${filter.streets.join(`', '`)}')`;
    finalQuery = `${finalQuery} AND street IN ${streetsValues}`;
  }
  console.log('🚀 ~ file: LiveDashboardPage.tsx:68 ~ queryBuilder ~ finalQuery:', finalQuery);
  return finalQuery;
};
