import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Select, SelectProps, Spin, message } from 'antd';
import useAxios from '../utils/useAxios';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dayjs from 'dayjs';
import '../styles/main.scss';
import { dataContext, filterContext, streetContext } from '../utils/contexts';
import { queryBuilder, queryFindStreet, queryStreetCoord } from '../utils/queryBuilder';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { StreetInMap } from '../types/StreetInMap';
import { useTranslation } from 'react-i18next';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFromMap, deleteMultipleFromMap, drawOnMap } from '../utils/map';
import LiveTilesColumn from '../Components/LiveTilesColumn';
import backendApi from '../utils/api';
import LineChartComponent from '../Components/GraphComponents/LineChartComponent';
import { DataDelay, DataEvent, Streets } from '../types/baseTypes';
import { getOptionsFromStreet } from '../utils/util';
import SidebarDrawer from '../layout/SidebarDrawer';

function findArrayElementByName(array: StreetInMap[], name: string) {
  return array?.find((element) => {
    return element?.name === name;
  });
}

function getXMinDate(toDate) {
  return dayjs(`${toDate}, 06:00:00`, { format: 'YYYY-MM-DD, HH:mm:ss' })
    .subtract(1, 'day')
    .format('YYYY-MM-DD, HH:mm:ss');
}

const LiveDashboardPage = () => {
  const { filter } = useContext(filterContext);
  const { t } = useTranslation();

  const { streetsInSelected, setNewStreetsInSelected, streetsInMap, setNewStreetsInMap } = useContext(streetContext);

  const {
    xAxisData,
    jamsData,
    alertData,
    previousDate,
    setXAxisData,
    setJamsData,
    setAlertData,
    dateTimeFrom,
    dateTimeTo,
    setDateTimeFrom,
    setDateTimeTo,
    setPreviousDate,
    setLengthData,
    setLevelData,
    setSpeedData,
    setTimeData,
  } = useContext(dataContext);

  const [open, setOpen] = useState(false);
  var options: SelectProps['options'] = [];

  const [sourceStreet, setSourceStreet] = useState<string>('');
  const [dstStreet, setDstStreet] = useState<string>('');
  const [passStreets, setPassStreets] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [statusFromStreet, setStatusFromStreet] = useState<'' | 'warning' | 'error'>('error');
  const [statusToStreet, setStatusToStreet] = useState<'' | 'warning' | 'error'>('error');
  const [routeStreets, setRouteStreets] = useState<any>([]);

  // const [previousDate, setPreviousDate] = useState<string>(() => getXMinDate(filter?.toDate));

  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const mapRef = useRef<LeafletMap>(null);

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

  const {
    response: dataStreets,
    loading: loadingStreets,
    error: errorStreets,
  } = useAxios<Streets>({
    url: 'query?where=1%3D1',
    api: 'street',
    getData: true,
  });

  // getting street name from click on map
  const LocationFinderDummy = () => {
    const map: L.Map = mapRef.current;
    const handleContextMenu = (e) => {
      e.originalEvent.preventDefault();
      //TODO: handle right click
    };
    useMapEvents({
      contextmenu: handleContextMenu,
      click: async (e) => {
        backendApi.get(`reverse_geocode/street/?${queryFindStreet(e, filter)}`).then((response) => {
          const name = response.data.street;
          const path = response.data.path;
          const color = response.data.color;
          deleteFromMap(streetsInMap, name);
          var streetsInMapStaying = streetsInMap.filter((street) => street.name !== name); // keeping everything but the one i deleted
          const newDrawedStreet: StreetInMap = drawOnMap(map, name, path, color);
          streetsInMapStaying.push(newDrawedStreet);
          setNewStreetsInMap(streetsInMapStaying);
          const newStreetsInSelected = [...new Set([...streetsInSelected, name])];
          setNewStreetsInSelected(newStreetsInSelected);
        });
      },
    });

    return null;
  };

  useEffect(() => {
    const map = mapRef.current;
    let newStreetsInMap = streetsInMap;
    // drawing/removing streets in selected
    streetsInSelected?.forEach((element) => {
      backendApi.get(`/street_coord/?${queryStreetCoord(filter, element)}`).then((response) => {
        const name = response.data.street;
        const path = response.data.path;
        const color = response.data.color;
        if (!findArrayElementByName(newStreetsInMap, name)) {
          const newDrawedStreet = drawOnMap(map, name, path, color);
          newStreetsInMap.push(newDrawedStreet);
        }
      });
    });
    const streetsInMapStaying = deleteMultipleFromMap(newStreetsInMap, streetsInSelected);
    setNewStreetsInMap(streetsInMapStaying);
  }, [streetsInSelected]);

  const showModal = () => {
    setOpen(true);
  };

  const find_route = () => {
    const data_search = {
      src_street: sourceStreet,
      dst_street: dstStreet,
      src_coord: null,
      dst_coord: null,
      pass_streets: [...new Set(passStreets)],
      from_time: `${filter.fromDate} ${filter.fromTime}:00`,
      to_time: `${filter.toDate} ${filter.toTime}:00`,
    };
    backendApi
      .post('find_route/', data_search)
      .then((response) => {
        setRouteStreets(response.data.streets_coord);
        setOpen(false);
      })
      .catch((error) => {
        if (error.response) {
          messageApi.open({
            type: 'error',
            content: t('route.notfound'),
          });
        }
      });
  };

  useEffect(() => {
    const map = mapRef.current;
    var newStreetsInMap: StreetInMap[] = [];
    var newSelected: string[] = [];

    // removing existing streets drawed
    deleteMultipleFromMap(streetsInMap, []);

    routeStreets?.forEach((element) => {
      const streetInMapNew: StreetInMap = drawOnMap(map, element.street_name, element?.path, element?.color);
      newStreetsInMap.push(streetInMapNew);
      newSelected.push(element.street_name);
    });
    setNewStreetsInMap(newStreetsInMap);
    setNewStreetsInSelected(newSelected);
  }, [routeStreets]);

  useEffect(() => {
    // already have the data, not necessary to call again - unless street changed! TODO
    if (
      dateTimeFrom === `${filter?.fromDate} ${filter?.fromTime}:00` &&
      dateTimeTo === `${filter?.toDate} ${filter?.toTime}:00`
    ) {
      return;
    } // todo compare dates not string

    if (filter) {
      const body = {
        from_date_time: `${filter?.fromDate} ${filter?.fromTime}:00`,
        to_date_time: `${filter?.toDate} ${filter?.toTime}:00`,
        streets: filter.streets,
      };

      setDateTimeFrom(`${filter.fromDate} ${filter.fromTime}:00`);
      setDateTimeTo(`${filter.toDate} ${filter.toTime}:00`);
      setPreviousDate(getXMinDate(filter?.toDate));

      backendApi.post('data_for_plot/', body).then((response) => {
        setJamsData(response.data.jams);
        setAlertData(response.data.alerts);
        setXAxisData(response.data.xaxis);
        setSpeedData(response.data.speedKMH);
        setTimeData(response.data.delay);
        setLevelData(response.data.level);
        setLengthData(response.data.length);
        console.log(response);
      });
    }
  }, [filter]);

  const handleOk = () => {
    if (!sourceStreet) {
      setStatusFromStreet('error');
      messageApi.open({
        type: 'error',
        content: t('route.source.missing'),
      });
    } else {
      setStatusFromStreet('');
    }
    if (!dstStreet) {
      setStatusToStreet('error');
      messageApi.open({
        type: 'error',
        content: t('route.dst.missing'),
      });
    } else {
      setStatusToStreet('');
    }
    if (sourceStreet && dstStreet) {
      find_route();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const addPassStreet = () => {
    setPassStreets((prevState) => [...prevState, '']);
  };

  options = getOptionsFromStreet(dataStreets);
  return (
    <>
      <Row>
        <Col span={20}>
          <Spin size="large" spinning={loadingDelay || loadingEvent}>
            <MapContainer ref={mapRef} center={[49.2, 16.6]} zoom={14} scrollWheelZoom={true} style={{ height: 580 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationFinderDummy />
            </MapContainer>
          </Spin>
          <div style={{ height: 50 }} className="modalButtonOpen">
            <Button className="filterStyle" onClick={showModal}>
              {t('route.button')}
            </Button>
            <Button type="primary" onClick={showDrawer}>
              {t('open.filters')}
            </Button>
            <SidebarDrawer open={openDrawer} onCloseDrawer={onCloseDrawer}></SidebarDrawer>
          </div>
          <div>
            {contextHolder}
            <Modal
              width={350}
              title={t('route.button')}
              open={open}
              onCancel={() => setOpen(false)}
              footer={[
                <div key={'top'} className="buttonsModal">
                  <Button key="Pass" className="modalButton" onClick={addPassStreet}>
                    {t('route.pass')}
                  </Button>

                  <div key={'right'} className="rightButtons">
                    <Button key="Cancel" className="modalButton" onClick={handleCancel}>
                      {t('cancel')}
                    </Button>
                    <Button key="Ok" className="modalButtonOk" onClick={handleOk}>
                      OK
                    </Button>
                  </div>
                </div>,
              ]}
            >
              <p>{t('route.source')}:</p>
              <Select
                showSearch
                key={'FromStreet'}
                status={statusFromStreet}
                className="modalStyle"
                allowClear
                placeholder={t('PleaseSelect')}
                onChange={(value) => {
                  setSourceStreet(value);
                  setStatusFromStreet('');
                }}
                //  TODO: filter ignore diacritics
                value={sourceStreet}
                options={options}
              />
              {passStreets.map((street, index) => (
                <div key={index.toString()}>
                  {index === 0 && <p>{t('route.pass')}:</p>}
                  <Select
                    showSearch
                    className="modalStylePass"
                    allowClear
                    placeholder={t('PleaseSelect')}
                    onChange={(value) => {
                      setPassStreets((prevState) => {
                        const stateCopy = [...prevState];
                        stateCopy[index] = value;
                        return stateCopy;
                      });
                    }}
                    //  TODO: filter ignore diacritics
                    value={street}
                    options={options}
                  />

                  <CloseOutlined
                    className="iconCancel"
                    onClick={() => {
                      setPassStreets((prevState) => {
                        const stateCopy = [...prevState];
                        stateCopy.splice(index, 1);
                        return stateCopy;
                      });
                    }}
                  />
                </div>
              ))}

              <br></br>
              <p>{t('route.dst')}:</p>
              <Select
                showSearch
                key={'endStreet'}
                status={statusToStreet}
                className="modalStyle"
                allowClear
                placeholder={t('PleaseSelect')}
                onChange={(value) => {
                  setDstStreet(value);
                  setStatusToStreet('');
                }}
                //  TODO: filter ignore diacritics
                value={dstStreet}
                options={options}
              />
            </Modal>
          </div>
        </Col>
        <Col span={4} className="live-map-top-row">
          <LiveTilesColumn dataDelay={dataDelay} dataEvent={dataEvent}></LiveTilesColumn>
        </Col>
      </Row>
      <Row>
        <LineChartComponent
          dataJams={jamsData}
          dataAlerts={alertData}
          xAxis={xAxisData}
          xaxis_min_selected={`${previousDate}`}
          xaxis_max_selected={`${filter?.toDate}, ${filter?.toTime}:00`}
        />
      </Row>
    </>
  );
};

export default LiveDashboardPage;
