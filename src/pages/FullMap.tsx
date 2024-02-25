import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import { Button, Col, Modal, Row } from 'antd';
import {
  BarChartOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  MailOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import StatsDrawer from '../Components/StatsDrawer';
import SidebarDrawer from '../layout/SidebarDrawer';

type Props = {};

const FullMap = (props: Props) => {
  const mapRef = useRef<LeafletMap>(null);
  const { t } = useTranslation();

  const [openInfoModalState, setOpenInfoModalState] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);

  const openFilters = () => {
    console.log('hi filters');
  };

  const openMenu = () => {
    console.log('hi menu');
  };

  const openMailForm = () => {
    console.log('hi contact');
  };

  return (
    <div>
      <Row>
        <Modal
          open={openInfoModalState}
          onCancel={() => setOpenInfoModalState(false)}
          title={t('app.title')}
          footer={null}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        <Col span={1} className="sidermenu">
          <MenuOutlined className="iconStyle" style={{ fontSize: 20, paddingBottom: 10 }} onClick={openMenu} />
          <br></br>
          <div onClick={() => setOpenDrawerFilter(true)} style={{ paddingBottom: 10 }}>
            <FilterOutlined
              className="iconStyle"
              style={{ fontSize: 20, paddingTop: 10 }}
              // onClick={() => console.log('hi')}
            />
            <p>Filter</p>
          </div>
          <div
            onClick={() => {
              setOpenDrawer(true);
            }}
            style={{ paddingBottom: 10 }}
          >
            <BarChartOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />

            <p>{t('graph.tiles.title')}</p>
          </div>

          <div onClick={openFilters} style={{ paddingBottom: 10 }}>
            <LineChartOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />

            <p>{t('graph.priebeh')}</p>
          </div>

          <div
            onClick={() => {
              setOpenInfoModalState(true);
            }}
            style={{
              paddingBottom: 10,
              position: 'absolute',
              bottom: '3%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <InfoCircleOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>Info</p>
          </div>
          <div
            onClick={openMailForm}
            style={{
              paddingBottom: 10,
              position: 'absolute',
              bottom: '-2%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <MailOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
            <p>{t('contact')}</p>
          </div>
        </Col>
        <Col span={23} style={{ position: 'relative' }}>
          <Button style={{ position: 'absolute', zIndex: 10000, left: 50, top: 10 }}>{t('route.button')}</Button>
          <Button style={{ position: 'absolute', zIndex: 10000, left: 160, top: 10 }}>{t('Jams')}</Button>
          <Button style={{ position: 'absolute', zIndex: 10000, left: 305, top: 10 }}>{t('Alerts')}</Button>
          <MapContainer
            ref={mapRef}
            center={[49.194391, 16.612064]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: 'calc(100dvh - 50px)', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </Col>
        <StatsDrawer
          open={openDrawer}
          onCloseDrawer={() => {
            setOpenDrawer(false);
          }}
        ></StatsDrawer>
        <SidebarDrawer open={openDrawerFilter} onCloseDrawer={() => setOpenDrawerFilter(false)}></SidebarDrawer>
      </Row>
    </div>
  );
};

export default FullMap;
