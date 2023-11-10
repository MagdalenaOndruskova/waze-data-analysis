import React from 'react';
import { Col, Row } from 'antd';
import LiveTile from './LiveTile';
import * as Icons from '../utils/icons';

const LiveTilesRow = ({ dataEvent, dataDelay, t }) => {
  return (
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
  );
};

export default LiveTilesRow;
