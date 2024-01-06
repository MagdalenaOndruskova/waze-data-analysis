import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import { TrafficDelay } from '../types/TrafficDelay';
import { TrafficEvent } from '../types/TrafficEvent';
import { Col, Row, Spin } from 'antd';
import LineChart from '../Components/LineChart';
import {
  prepareCriticalStreetsByAlerts,
  prepareCriticalStreetsByJams,
  prepareDataAlertsType,
  prepareDataAverageSpeed,
  prepareDataJamLevel,
  prepareDataJamType,
} from '../utils/prepareData';
import PieChart from '../Components/PieChart';
import BarChart from '../Components/BarChart';
import { queryBuilder } from '../utils/queryBuilder';
import { useTranslation } from 'react-i18next';
import LiveTilesRow from '../Components/LiveTilesRow';
import { dataContext, filterContext } from '../utils/contexts';
import LineChartComponent from '../Components/GraphComponents/LineChartComponent';
import MultipleYChartComponent from '../Components/GraphComponents/MultipleYChartComponent';
import backendApi from '../utils/api';
import BarChartComponent from '../Components/GraphComponents/BarChartComponent';

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
    setJamsData,
    setAlertData,
    dateTimeFrom,
    dateTimeTo,
    setDateTimeFrom,
    setDateTimeTo,
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
    console.log('tam');
    if (filter) {
      console.log('tu');
      const body = {
        from_date_time: `${filter?.fromDate} ${filter?.fromTime}:00`,
        to_date_time: `${filter?.toDate} ${filter?.toTime}:00`,
        streets: filter.streets,
      };
      backendApi.post('data_for_plot_streets/', body).then((response) => {
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
          <Row>
            <Col lg={12} md={12}>
              <LineChartComponent
                dataJams={jamsData}
                dataAlerts={alertData}
                xAxis={xAxisData}
                xaxis_min_selected={`${previousDate}`}
                xaxis_max_selected={`${filter?.toDate}, ${filter?.toTime}:00`}
              />
            </Col>
            <Col lg={12} md={12}>
              <MultipleYChartComponent
                dataFirst={timeData}
                dataSecond={lengthData}
                xAxis={xAxisData}
                yAxisFirst={'graph.delayInMinutes'}
                yAxisSecond={'graph.countInMetres'}
                labelFirst={'tile.JamsDelay'}
                labelSecond={'tile.JamsLength'}
              ></MultipleYChartComponent>
            </Col>
            <Col lg={12} md={12}>
              <MultipleYChartComponent
                dataFirst={levelData}
                dataSecond={speedData}
                labelFirst={'tile.AverageJamLevel'}
                labelSecond={'tile.AverageSpeed'}
                yAxisFirst={'graph.level'}
                yAxisSecond={'graph.speed'}
                xAxis={xAxisData}
              ></MultipleYChartComponent>
            </Col>
            {/* <Col lg={8} md={12}>
              <BarChartComponent
                streets={criticalStreetsAlerts.streets}
                values={criticalStreetsAlerts.values}
              ></BarChartComponent>
            </Col>
            <Col lg={8} md={12}>
              <BarChartComponent
                streets={criticalStreetsJams.streets}
                values={criticalStreetsJams.values}
              ></BarChartComponent>
            </Col> */}

            <Col lg={8} style={{ height: 280 }} md={12}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px', paddingTop: '10px' }}>
                {t('tile.AlertsType')}:
              </h3>
              <PieChart values={prepareDataAlertsType(dataEvent, t)} />
            </Col>
            <Col lg={8} md={12} style={{ height: 280 }}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px', paddingTop: '10px' }}>
                {t('tile.JamsType')}:
              </h3>
              <PieChart values={prepareDataJamType(dataDelay, t)}></PieChart>
            </Col>
            <Col lg={8} style={{ height: 280 }} md={12}>
              <h3
                style={{
                  lineHeight: '15px',
                  textAlign: 'left',
                  paddingLeft: '10px',
                  paddingTop: '10px',
                  paddingBottom: '0px',
                }}
              >
                {t('tile.CriticalStreetsAlerts')}:
              </h3>
              <BarChart values={prepareCriticalStreetsByAlerts(dataEvent)} legend="alerts"></BarChart>
            </Col>
            <Col lg={8} style={{ height: 280 }} md={12}>
              <h3
                style={{
                  lineHeight: '15px',
                  textAlign: 'left',
                  paddingLeft: '10px',
                  paddingTop: '10px',
                  paddingBottom: '0px',
                }}
              >
                {t('tile.CriticalStreetsJams')}:
              </h3>
              <BarChart values={prepareCriticalStreetsByJams(dataDelay)} legend="jams"></BarChart>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
