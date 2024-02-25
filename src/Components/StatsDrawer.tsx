import { Drawer } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useAxios from '../utils/useAxios';
import { DataDelay, DataEvent } from '../types/baseTypes';
import { queryBuilder } from '../utils/queryBuilder';
import { filterContext } from '../utils/contexts';
import LiveTile from './LiveTile';
import * as Icons from '../utils/icons';

type Props = {};

const StatsDrawer = ({ open, onCloseDrawer }) => {
  const { t } = useTranslation();
  const { filter } = useContext(filterContext);

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

  return (
    <Drawer
      className="sidebar-drawer"
      title={t('graph.tiles.title')}
      placement="left"
      onClose={onCloseDrawer}
      open={open}
      width={'250px'}
      closable={true}
      zIndex={10000}
    >
      <LiveTile
        icon={<Icons.WarningIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(dataEvent?.features?.length)}
        tileType={t('tile.ActiveAlerts')}
      ></LiveTile>
      <br />
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(dataDelay?.features?.length)}
        tileType={t('tile.TrafficJams')}
      ></LiveTile>
      <br />
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
      <br />
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'kilometer',
        }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.length, 0) / 1000)}
        tileType={t('tile.JamsLength')}
      ></LiveTile>
      <br />

      <LiveTile
        icon={<Icons.JamDelayIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'hour',
        }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.delay, 0) / 3600)}
        tileType={t('tile.JamsDelay')}
      ></LiveTile>
      <br />

      <LiveTile
        icon={<Icons.JamLevelIcon />}
        tileTitle={(
          dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.level, 0) / dataDelay?.features?.length
        ).toFixed(2)}
        tileType={t('tile.AverageJamLevel')}
      ></LiveTile>
    </Drawer>
  );
};

export default StatsDrawer;
