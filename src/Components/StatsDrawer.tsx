import { Drawer } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { dataContext } from '../utils/contexts';
import LiveTile from './LiveTile';
import * as Icons from '../utils/icons';

type Props = {
  open: boolean;
  onCloseDrawer: any;
};

const StatsDrawer = ({ open, onCloseDrawer }: Props) => {
  const { t } = useTranslation();
  const { jamsData, alertData, levelData, speedData, lengthData, timeData } = useContext(dataContext);

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
        tileTitle={new Intl.NumberFormat('cs-CZ').format(alertData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.ActiveAlerts')}
      ></LiveTile>
      <br />
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(jamsData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.TrafficJams')}
      ></LiveTile>
      <br />
      <LiveTile
        icon={<Icons.SpeedIcon />}
        tileTitle={new Intl.NumberFormat('pt-PT', {
          style: 'unit',
          unit: 'kilometer-per-hour',
        }).format(Number((speedData?.reduce((sum, attribute) => sum + attribute, 0) / jamsData?.length).toFixed(2)))}
        tileType={t('tile.AverageSpeed')}
      ></LiveTile>
      <br />
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'kilometer',
        }).format(lengthData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.JamsLength')}
      ></LiveTile>
      <br />

      <LiveTile
        icon={<Icons.JamDelayIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'hour',
        }).format(timeData?.reduce((sum, attribute) => sum + attribute, 0) / 60)}
        tileType={t('tile.JamsDelay')}
      ></LiveTile>
      <br />

      <LiveTile
        icon={<Icons.JamLevelIcon />}
        tileTitle={(levelData?.reduce((sum, attribute) => sum + attribute, 0) / jamsData?.length).toFixed(2)}
        tileType={t('tile.AverageJamLevel')}
      ></LiveTile>
    </Drawer>
  );
};

export default StatsDrawer;
