import React, { useContext, useState } from 'react';
import { Street } from '../types/Street';
import useAxios from '../utils/useAxios';
import { TrafficDelay, TrafficDelayPlot } from '../types/TrafficDelay';
import { TrafficEvent, TrafficEventPlot } from '../types/TrafficEvent';
import { Col, Row, Spin } from 'antd';
import LiveTile from '../Components/LiveTile';
import * as Icons from '../utils/icons';
import LineChart from '../Components/LineChart';
import {
  prepareCriticalStreetsByAlerts,
  prepareCriticalStreetsByJams,
  prepareData,
  prepareDataAlertsType,
  prepareDataAverageSpeed,
  prepareDataDelay,
  prepareDataJamLength,
  prepareDataJamLevel,
  prepareDataJamType,
} from '../utils/prepareData';
import PieChart from '../Components/PieChart';
import BarChart from '../Components/BarChart';
import { filterContext } from '../utils/contexts';
import { queryBuilder } from '../utils/queryBuilder';
import { useTranslation } from 'react-i18next';

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

type DateFilter = {
  dateFrom: string;
  dateTo: string;
};
const Dashboard = () => {
  const { filter } = useContext(filterContext);

  const { t } = useTranslation();

  const query = queryBuilder(filter);

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
          <Row gutter={8} className="top-row">
            <Col span={4} flex="auto">
              <LiveTile
                icon={<Icons.WarningIcon />}
                tileTitle={new Intl.NumberFormat('cs-CZ').format(dataEvent?.features?.length)}
                tileType={t('tile.ActiveAlerts')}
              ></LiveTile>
            </Col>
            <Col span={4} flex="auto">
              <LiveTile
                icon={<Icons.CarIcon />}
                tileTitle={new Intl.NumberFormat('cs-CZ').format(dataDelay?.features?.length)}
                tileType={t('tile.TrafficJams')}
              ></LiveTile>
            </Col>
            <Col span={4} flex="auto">
              <LiveTile
                icon={<Icons.SpeedIcon />}
                tileTitle={new Intl.NumberFormat('pt-PT', {
                  style: 'unit',
                  unit: 'kilometer-per-hour',
                }).format(
                  Number(
                    (
                      dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.speedKMH, 0) /
                      dataDelay?.features?.length
                    ).toFixed(2),
                  ),
                )}
                tileType={t('tile.AverageSpeed')}
              ></LiveTile>
            </Col>
            <Col span={4} flex="auto">
              <LiveTile
                icon={<Icons.CarIcon />}
                tileTitle={new Intl.NumberFormat('pt-PT', {
                  style: 'unit',
                  unit: 'meter',
                }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.length, 0))}
                tileType={t('tile.JamsLength')}
              ></LiveTile>
            </Col>
            <Col span={4} flex="auto">
              <LiveTile
                icon={<Icons.JamDelayIcon />}
                tileTitle={new Intl.NumberFormat('pt-PT', {
                  style: 'unit',
                  unit: 'second',
                }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.delay, 0))}
                tileType={t('tile.JamsDelay')}
              ></LiveTile>
            </Col>
            <Col span={4} flex="auto">
              <LiveTile
                icon={<Icons.JamLevelIcon />}
                tileTitle={(
                  dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.level, 0) /
                  dataDelay?.features?.length
                ).toFixed(2)}
                tileType={t('tile.AverageJamLevel')}
              ></LiveTile>
            </Col>
          </Row>
          <Row>
            <Col style={{ height: 295 }} lg={8} md={12}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px' }}>{t('tile.ActiveAlerts')}:</h3>
              <LineChart
                data={prepareData(null, dataEvent)}
                xTickValues="every 12 hour"
                yAxisValue={t('plot.Count')}
              ></LineChart>
            </Col>
            <Col style={{ height: 295 }} lg={8} md={12}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px' }}>{t('tile.TrafficJams')}:</h3>
              <LineChart
                data={prepareData(dataDelay, null)}
                xTickValues="every 12 hour"
                yAxisValue={t('plot.Count')}
              ></LineChart>
            </Col>
            <Col style={{ height: 295 }} lg={8} md={12}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px' }}>
                {t('tile.AverageJamLevel')}:
              </h3>
              <LineChart
                data={prepareDataJamLevel(dataDelay)}
                xTickValues="every 12 hour"
                yAxisValue={t('plot.Count')}
              ></LineChart>
            </Col>
            <Col style={{ height: 295 }} lg={8} md={12}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px' }}>{t('tile.JamsLength')}:</h3>
              <LineChart
                data={prepareDataJamLength(dataDelay)}
                xTickValues="every 12 hour"
                yAxisValue={t('plot.Count')}
              ></LineChart>
            </Col>
            {/* </Row>

          <Row className="graphs-row"> */}
            <Col lg={8} style={{ height: 280 }} md={12}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px', paddingTop: '10px' }}>
                {t('tile.AverageSpeed')}:
              </h3>
              <LineChart
                data={prepareDataAverageSpeed(dataDelay)}
                xTickValues="every 12 hour"
                yAxisValue={t('plot.Count')}
              ></LineChart>
              {/* <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px' }}>Jam Delay:</h3>
              <LineChart data={prepareDataDelay(dataDelay)} xTickValues="every 12 hour" yAxisValue="Count"></LineChart> */}
            </Col>
            <Col lg={8} md={12} style={{ height: 280 }}>
              <h3 style={{ lineHeight: '15px', textAlign: 'left', paddingLeft: '10px' }}>{t('tile.JamsDelay')}:</h3>
              <LineChart
                data={prepareDataDelay(dataDelay)}
                xTickValues="every 12 hour"
                yAxisValue={t('plot.Count')}
              ></LineChart>
            </Col>
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
