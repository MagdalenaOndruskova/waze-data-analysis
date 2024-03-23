import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Select, Spin } from 'antd';
import { queryBuilder } from '../utils/queryBuilder';
import { useTranslation } from 'react-i18next';
import { dataContext, filterContext } from '../utils/contexts';
import MultipleYChartComponent from '../Components/GraphComponents/MultipleYChartComponent';
import backendApi from '../utils/api';
import BarChartComponent from '../Components/GraphComponents/BarChartComponent';
import ChartTimelineComponent from '../Components/GraphComponents/ChartTimelineComponent';
import LineChartComponentV2 from '../Components/GraphComponents/LineChartComponentV2';
import StatsTilesComplet from '../Components/StatsTilesComponents/StatsTileComplet';
import { get_data_alert_types, get_data_critical_streets, get_data_delay_alerts } from '../utils/backendApiRequests';

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

  const [loadingAlertTypes, setLoadingAlertTypes] = useState<boolean>(false);
  const [loadingCriticalStreets, setLoadingCriticalStreets] = useState<boolean>(false);

  const {
    xAxisData,
    jamsData,
    alertData,
    lengthData,
    timeData,
    levelData,
    speedData,
    previousDate,
    alertTypes,
    setAlertTypes,
  } = useContext(dataContext);

  useEffect(() => {
    // Update options when alertTypes or t changes
    if (alertTypes && alertTypes['basic_types_labels']) {
      const updatedOptions = alertTypes['basic_types_labels']?.map((value) => ({
        value,
        label: t(value),
      }));
      setOptions(updatedOptions);
    }
  }, [alertTypes]);

  useEffect(() => {
    if (!filter) {
      return;
    }
    setLoadingCriticalStreets(true);
    setLoadingAlertTypes(true);

    const get_critical_streets_data = async () => {
      const data = await get_data_critical_streets(filter);
      setCriticalStreetsJams({ streets: data.streets_jams, values: data.values_jams });
      setCriticalStreetsAlerts({ streets: data.streets_alerts, values: data.values_alerts });
      setLoadingCriticalStreets(false);
    };
    const get_alert_types_data = async () => {
      const data = await get_data_alert_types(filter);
      setAlertTypes(data);
      setLoadingAlertTypes(false);
    };

    get_critical_streets_data();
    get_alert_types_data();
  }, [filter]);

  return (
    <div style={{ padding: '12px' }}>
      <div className="top-row">
        <StatsTilesComplet spaceBetween={false} isDashboard={true} />
      </div>
      <Row className="dashboard-row" gutter={24}>
        <Col xxl={5} xl={12} lg={12} md={24} className="alerts-type-col">
          <Card title={t('tile.AlertsType')}>
            <Spin tip={t('loading.data')} size="large" spinning={loadingAlertTypes}>
              <BarChartComponent
                streets={alertTypes['basic_types_labels']?.map((value) => t(value))}
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
            </Spin>
          </Card>
        </Col>
        <Col xxl={12} xl={24} lg={24} md={24} className="graphs-col">
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
        <Col xxl={7} xl={12} lg={12} md={24} className="graph-tiles-col">
          <Card title={t('graph.tiles.title')}>
            <Spin tip={t('loading.data')} size="large" spinning={loadingCriticalStreets}>
              <BarChartComponent
                streets={criticalStreetsAlerts?.streets}
                values={criticalStreetsAlerts?.values}
                id="chart-bar1"
                title={t('tile.CriticalStreetsAlerts')}
              ></BarChartComponent>
              <BarChartComponent
                streets={criticalStreetsJams?.streets}
                values={criticalStreetsJams?.values}
                id="chart-bar2"
                title={t('tile.CriticalStreetsJams')}
              ></BarChartComponent>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
