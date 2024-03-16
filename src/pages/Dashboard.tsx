import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import { TrafficDelay } from '../types/TrafficDelay';
import { TrafficEvent } from '../types/TrafficEvent';
import { Card, Col, Row, Select, Spin } from 'antd';
import {
  prepareCriticalStreetsByAlerts,
  prepareCriticalStreetsByJams,
  prepareDataAlertsType,
  prepareDataAverageSpeed,
  prepareDataJamLevel,
  prepareDataJamType,
} from '../utils/prepareData';
import { queryBuilder } from '../utils/queryBuilder';
import { useTranslation } from 'react-i18next';
import LiveTilesRow from '../Components/LiveTilesRow';
import { dataContext, filterContext } from '../utils/contexts';
import MultipleYChartComponent from '../Components/GraphComponents/MultipleYChartComponent';
import backendApi from '../utils/api';
import BarChartComponent from '../Components/GraphComponents/BarChartComponent';
import ChartTimelineComponent from '../Components/GraphComponents/ChartTimelineComponent';
import LineChartComponentV2 from '../Components/GraphComponents/LineChartComponentV2';

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

type BarChartData = {
  streets: [];
  values: [];
};

const Dashboard = () => {
  const { filter } = useContext(filterContext);
  const { t } = useTranslation();
  const query = queryBuilder(filter);

  const [criticalStreetsAlerts, setCriticalStreetsAlerts] = useState<BarChartData>({ streets: [], values: [] });
  const [criticalStreetsJams, setCriticalStreetsJams] = useState<BarChartData>({ streets: [], values: [] });

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState<string>('ACCIDENT');

  const {
    xAxisData,
    jamsData,
    alertData,
    lengthData,
    timeData,
    levelData,
    speedData,
    previousDate,
    setXAxisData,
    setAlertData,
    dateTimeFrom,
    dateTimeTo,
    setDateTimeFrom,
    setDateTimeTo,
    alertTypes,
    setAlertTypes,
  } = useContext(dataContext);

  const {
    response: dataDelay,
    loading: loadingDelay,
    error: errorDelay,
  } = useAxios<DataDelay>({
    url: `query?where=(${query})`,
    api: 'jam',
    getData: filter !== null,
  });

  const {
    response: dataEvent,
    loading: loadingEvent,
    error: errorEvent,
  } = useAxios<DataEvent>({
    url: `query?where=(${query})`,
    api: 'event',
    getData: filter !== null,
  });

  useEffect(() => {
    // Update options when alertTypes or t changes
    if (alertTypes && alertTypes['basic_types_labels']) {
      const updatedOptions = alertTypes['basic_types_labels']?.map((value) => ({
        value,
        label: t(value),
      }));
      console.log('🚀 ~ file: Dashboard.tsx:104 ~ updatedOptions ~ updatedOptions:', updatedOptions);
      setOptions(updatedOptions);
    }
  }, [alertTypes]);

  useEffect(() => {
    if (filter) {
      const body = {
        from_date: `${filter?.fromDate}`,
        to_date: `${filter?.toDate}`,
        streets: filter.streets,
      };
      backendApi.post('data_for_plot_streets/', body).then((response) => {
        console.log('🚀 ~ backendApi.post ~ response:', response);

        setCriticalStreetsJams({ streets: response.data.streets_jams, values: response.data.values_jams });
        setCriticalStreetsAlerts({ streets: response.data.streets_alerts, values: response.data.values_alerts });
      });
    }
  }, [filter]);
  const streetsAlerts = prepareCriticalStreetsByAlerts(dataEvent);

  return (
    <div>
      {loadingDelay || loadingEvent ? (
        <div>
          <h1>Loading... </h1>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <LiveTilesRow dataDelay={dataDelay} dataEvent={dataEvent} t={t}></LiveTilesRow>
          <Row className="dashboard-row" gutter={24}>
            <Col span={5}>
              <Card title={t('tile.AlertsType')}>
                <BarChartComponent
                  streets={alertTypes['basic_types_labels'].map((value) => t(value))}
                  values={alertTypes['basic_types_values']}
                  id="chart-bar3"
                  title={''}
                ></BarChartComponent>
                <Select
                  className="filterStyle"
                  value={selected}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    setSelected(value);
                  }}
                  options={options}
                />
                <BarChartComponent
                  streets={alertTypes[selected]?.subtype_labels.map((value) => t(value))}
                  values={alertTypes[selected]?.subtype_values}
                  id="chart-bar4"
                  title={''}
                ></BarChartComponent>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={t('graphs.title')}>
                <ChartTimelineComponent
                  dataJams={jamsData}
                  dataAlerts={alertData}
                  xAxis={xAxisData}
                  xaxis_min_selected={`${previousDate}`}
                  xaxis_max_selected={`${filter?.toDate}`}
                  targets={['chart3', 'chart2', 'chart4']}
                />
                <LineChartComponentV2
                  dataFirst={jamsData}
                  dataSecond={alertData}
                  xAxis={xAxisData}
                  labelFirst={'Jams'}
                  labelSecond={'Alerts'}
                  yAxisFirst={'plot.Count'}
                  chartId={'chart2'}
                />
                <MultipleYChartComponent
                  dataFirst={timeData}
                  dataSecond={lengthData}
                  xAxis={xAxisData}
                  yAxisFirst={'graph.delayInMinutes'}
                  yAxisSecond={'graph.countInMetres'}
                  labelFirst={'tile.JamsDelay'}
                  labelSecond={'tile.JamsLength'}
                  chartId={'chart3'}
                ></MultipleYChartComponent>
                <MultipleYChartComponent
                  dataFirst={levelData}
                  dataSecond={speedData}
                  labelFirst={'tile.AverageJamLevel'}
                  labelSecond={'tile.AverageSpeed'}
                  yAxisFirst={'graph.level'}
                  yAxisSecond={'graph.speed'}
                  xAxis={xAxisData}
                  chartId={'chart4'}
                ></MultipleYChartComponent>
              </Card>
            </Col>
            <Col span={7}>
              <Card title={t('graph.tiles.title')}>
                <BarChartComponent
                  streets={criticalStreetsAlerts.streets}
                  values={criticalStreetsAlerts.values}
                  id="chart-bar1"
                  title={t('tile.CriticalStreetsAlerts')}
                ></BarChartComponent>
                <BarChartComponent
                  streets={criticalStreetsJams.streets}
                  values={criticalStreetsJams.values}
                  id="chart-bar2"
                  title={t('tile.CriticalStreetsJams')}
                ></BarChartComponent>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
